export async function fetchStandings() {
  let res;

  if (import.meta.env.DEV) {
    res = await fetch('/api/nhl/standings/now');
    if (!res.ok) throw new Error(`NHL API error (${res.status})`);
    const data = await res.json();
    return { standings: data.standings, updated_at: null };
  } else {
    res = await fetch('/data/standings.json');
    if (!res.ok) throw new Error(`Could not load standings data (${res.status}). Run the Lambda to populate it.`);
    const data = await res.json();
    return { standings: data.standings, updated_at: data.updated_at };
  }
}

export async function fetchSchedule() {
  if (import.meta.env.DEV) {
    // Paginate up to 4 weeks through Vite proxy
    const games = [];
    let path = '/api/nhl/schedule/now';

    for (let i = 0; i < 4; i++) {
      const res = await fetch(path);
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
      path = `/api/nhl/schedule/${data.nextStartDate}`;
    }

    return games;
  } else {
    const res = await fetch('/data/schedule.json');
    if (!res.ok) return [];
    const data = await res.json();
    return data.games ?? [];
  }
}
