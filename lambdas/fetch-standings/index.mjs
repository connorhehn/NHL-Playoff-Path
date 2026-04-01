import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';

const s3 = new S3Client({});
const cf = new CloudFrontClient({ region: 'us-east-1' });

const NHL_STANDINGS_URL = 'https://api-web.nhle.com/v1/standings/now';
const BUCKET = process.env.DATA_BUCKET;
const CF_DISTRIBUTION_ID = process.env.CF_DISTRIBUTION_ID;

export async function handler(event) {
  console.log('Fetching NHL standings...');

  const response = await fetch(NHL_STANDINGS_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`NHL API responded ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const updated_at = new Date().toISOString();

  const payload = {
    updated_at,
    standings: data.standings,
  };

  // Write to S3
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: 'data/standings.json',
      Body: JSON.stringify(payload),
      ContentType: 'application/json',
      CacheControl: 'max-age=300', // 5 min browser cache
    })
  );
  console.log(`Wrote standings.json to s3://${BUCKET}/data/standings.json`);

  // Invalidate CloudFront so users get fresh data immediately
  await cf.send(
    new CreateInvalidationCommand({
      DistributionId: CF_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: updated_at,
        Paths: { Quantity: 1, Items: ['/data/standings.json'] },
      },
    })
  );
  console.log('CloudFront invalidation created');

  return {
    statusCode: 200,
    updated_at,
    team_count: data.standings.length,
  };
}
