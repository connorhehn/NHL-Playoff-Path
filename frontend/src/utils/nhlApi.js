export async function fetchStandings() {
  let res;

  if (import.meta.env.DEV) {
    // Vite proxy handles CORS locally (see vite.config.js server.proxy)
    res = await fetch('/api/nhl/standings/now');
    if (!res.ok) throw new Error(`NHL API error (${res.status})`);
    const data = await res.json();
    return { standings: data.standings, updated_at: null };
  } else {
    // Production: read pre-fetched JSON written by Lambda to S3/CloudFront
    res = await fetch('/data/standings.json');
    if (!res.ok) throw new Error(`Could not load standings data (${res.status}). Run the Lambda to populate it.`);
    const data = await res.json();
    return { standings: data.standings, updated_at: data.updated_at };
  }
}
