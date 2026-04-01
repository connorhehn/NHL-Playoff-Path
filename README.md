# NHL Playoff Path

The NHL provides live standings data through a public API, but there's no clean way to see the current playoff picture at a glance — which teams are in, which are on the bubble, and what the first-round bracket looks like. This project pulls that data into a dark-themed React UI that shows live division standings, playoff seeding, and first-round matchups for both conferences.

**[Live site →](https://nhlplayoffpath.com)**

---

## How it works

A private Lambda function fetches current standings from the NHL API, wraps the response with an `updated_at` timestamp, and writes it to S3. CloudFront serves both the static frontend and the standings data from the same distribution. The site shows when the data was last refreshed and the Lambda is invoked manually whenever an update is needed.

```
Lambda (manual invoke)
 → NHL API → standings.json → S3 → CloudFront → Browser
```

The frontend computes playoff seeding entirely client-side from the raw standings data: top 3 from each division qualify automatically, and the best 2 remaining records in each conference take the wild card spots. First-round matchups are derived from those seeds — no backend logic needed.

Infrastructure is defined in TypeScript CDK: a private S3 bucket, CloudFront distribution with OAC, and the Lambda function with scoped IAM permissions to write to S3 and invalidate the CloudFront cache.

---

## Interesting problems

**The NHL API blocks browser requests.** `api-web.nhle.com` doesn't return `Access-Control-Allow-Origin` headers, so fetch calls from the browser are rejected by CORS policy. Rather than stand up a proxy server, the Lambda fetches the data server-side and stores the result in S3. The frontend reads a static JSON file from its own CloudFront origin — no cross-origin requests at runtime.

**`/standings/now` redirects to a dated URL.** The NHL API redirects `/standings/now` to the current date (e.g. `/standings/2026-03-31`). Vite's dev proxy follows this redirect server-side using `followRedirects: true`, so the browser never sees the redirect and CORS doesn't apply in development either.

---

## Stack

- **Infrastructure** — TypeScript CDK (S3, CloudFront with OAC, Lambda, IAM)
- **Backend** — Node.js 22 Lambda function
- **Frontend** — React, Vite, Tailwind CSS v4
- **Region** — us-east-1

---

## Local development

```bash
npm run frontend:dev
```

The Vite dev server proxies `/api/nhl/*` to `https://api-web.nhle.com/v1/*` to work around CORS locally.

## Deploying

```bash
# Build the frontend and deploy the CDK stack
npm run frontend:build
npm run deploy
```

After the first deploy, invoke the Lambda to populate the standings data:

```bash
aws lambda invoke --function-name <FetchFunctionName from CDK output> response.json
```
