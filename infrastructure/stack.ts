import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as events from 'aws-cdk-lib/aws-events';
import * as eventTargets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import * as path from 'path';

const DOMAIN = 'nhlplayoffpath.com';

export class NhlPlayoffPathStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── Route 53 Hosted Zone (already exists from domain registration) ─────
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: DOMAIN,
    });

    // ── ACM Certificate (must be us-east-1 for CloudFront) ────────────────
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: DOMAIN,
      subjectAlternativeNames: [`www.${DOMAIN}`],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // ── S3 Bucket (private) ────────────────────────────────────────────────
    const bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // ── CloudFront OAC ─────────────────────────────────────────────────────
    const oac = new cloudfront.S3OriginAccessControl(this, 'OAC', {
      description: 'NHL Playoff Path OAC',
    });

    // Short TTL cache policy for /data/* so fresh standings show quickly
    const dataCachePolicy = new cloudfront.CachePolicy(this, 'DataCachePolicy', {
      defaultTtl: cdk.Duration.minutes(5),
      maxTtl: cdk.Duration.minutes(15),
      minTtl: cdk.Duration.seconds(0),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
    });

    // ── CloudFront Distribution ────────────────────────────────────────────
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      domainNames: [DOMAIN, `www.${DOMAIN}`],
      certificate,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket, {
          originAccessControl: oac,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        '/data/*': {
          origin: origins.S3BucketOrigin.withOriginAccessControl(bucket, {
            originAccessControl: oac,
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: dataCachePolicy,
        },
      },
      // SPA routing: 403/404 → index.html
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html' },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html' },
      ],
    });

    // ── Route 53 DNS Records ───────────────────────────────────────────────
    new route53.ARecord(this, 'ARecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    new route53.ARecord(this, 'WwwARecord', {
      zone: hostedZone,
      recordName: 'www',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    // ── Lambda: Fetch NHL Standings ────────────────────────────────────────
    const fetchFn = new lambda.Function(this, 'FetchStandingsFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '..', 'lambdas', 'fetch-standings')
      ),
      timeout: cdk.Duration.minutes(1),
      memorySize: 256,
      environment: {
        DATA_BUCKET: bucket.bucketName,
        CF_DISTRIBUTION_ID: distribution.distributionId,
      },
      description: 'Fetches NHL standings from the NHL API and writes standings.json to S3',
    });

    bucket.grantPut(fetchFn);

    fetchFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [
          `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
        ],
      })
    );

    // ── EventBridge: auto-refresh standings every 30 min during game hours ──
    // Active windows (all times ET, converted to UTC assuming EDT = UTC-4):
    //   1pm–midnight ET  = 17:00–23:30 UTC  (rule 1)
    //   midnight–3am ET  = 00:00–07:00 UTC  (rule 2)
    const scheduleTarget = new eventTargets.LambdaFunction(fetchFn);

    new events.Rule(this, 'RefreshAfternoonEvening', {
      description: 'Refresh NHL standings every 30 min, 1pm–midnight ET',
      schedule: events.Schedule.cron({ minute: '0,30', hour: '17-23' }),
      targets: [scheduleTarget],
      enabled: false, // re-enable at start of next regular season
    });

    new events.Rule(this, 'RefreshOvernight', {
      description: 'Refresh NHL standings every 30 min, midnight–3am ET',
      schedule: events.Schedule.cron({ minute: '0,30', hour: '0-7' }),
      targets: [scheduleTarget],
      enabled: false, // re-enable at start of next regular season
    });

    // ── Deploy React frontend to S3 ────────────────────────────────────────
    new s3deploy.BucketDeployment(this, 'DeployFrontend', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '..', 'frontend', 'dist'))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // ── Outputs ────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'SiteUrl', {
      value: `https://${DOMAIN}`,
      description: 'Live site URL',
    });

    new cdk.CfnOutput(this, 'FetchFunctionName', {
      value: fetchFn.functionName,
      description: 'Invoke this to refresh NHL standings: aws lambda invoke --function-name <name> response.json',
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
    });
  }
}
