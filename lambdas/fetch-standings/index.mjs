import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';

const s3 = new S3Client({});
const cf = new CloudFrontClient({ region: 'us-east-1' });

const NHL_BASE = 'https://api-web.nhle.com/v1';
const BUCKET = process.env.DATA_BUCKET;
const CF_DISTRIBUTION_ID = process.env.CF_DISTRIBUTION_ID;
const HEADERS = { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' };

async function fetchStandings() {
  const res = await fetch(`${NHL_BASE}/standings/now`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Standings API ${res.status}`);
  const data = await res.json();
  return data.standings;
}

async function fetchRemainingGames() {
  const games = [];
  let url = `${NHL_BASE}/schedule/now`;

  // Paginate week by week until no future games remain (max 8 weeks = rest of season)
  for (let i = 0; i < 8; i++) {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) break;
    const data = await res.json();

    let foundFuture = false;
    for (const week of data.gameWeek ?? []) {
      for (const game of week.games ?? []) {
        if (game.gameType === 2 && game.gameState === 'FUT') {
          foundFuture = true;
          games.push({
            id: game.id,
            date: week.date,
            startTimeUTC: game.startTimeUTC,
            awayTeam: {
              abbrev: game.awayTeam.abbrev,
              name: game.awayTeam.commonName?.default ?? game.awayTeam.abbrev,
              logo: game.awayTeam.logo,
            },
            homeTeam: {
              abbrev: game.homeTeam.abbrev,
              name: game.homeTeam.commonName?.default ?? game.homeTeam.abbrev,
              logo: game.homeTeam.logo,
            },
          });
        }
      }
    }

    if (!foundFuture || !data.nextStartDate) break;
    url = `${NHL_BASE}/schedule/${data.nextStartDate}`;
  }

  return games;
}

async function putS3(key, body) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: JSON.stringify(body),
      ContentType: 'application/json',
      CacheControl: 'max-age=300',
    })
  );
  console.log(`Wrote ${key} to s3://${BUCKET}`);
}

export async function handler() {
  console.log('Fetching NHL standings and schedule...');
  const updated_at = new Date().toISOString();

  const [standings, games] = await Promise.all([fetchStandings(), fetchRemainingGames()]);

  await Promise.all([
    putS3('data/standings.json', { updated_at, standings }),
    putS3('data/schedule.json', { updated_at, games }),
  ]);

  // Invalidate both data files at once
  await cf.send(
    new CreateInvalidationCommand({
      DistributionId: CF_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: updated_at,
        Paths: { Quantity: 2, Items: ['/data/standings.json', '/data/schedule.json'] },
      },
    })
  );
  console.log('CloudFront invalidation created');

  return { statusCode: 200, updated_at, team_count: standings.length, remaining_games: games.length };
}
