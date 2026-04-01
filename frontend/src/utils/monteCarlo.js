import { computePlayoffTeams } from './playoffEngine';

const NUM_SIMS = 5000;
const OT_RATE = 0.22; // ~22% of NHL games go to OT/SO historically

function getAwayWinProb(awayPctg, homePctg) {
  const total = awayPctg + homePctg;
  if (total === 0) return 0.5;
  // Slight home-ice advantage: weight home team by 1.05
  const awayAdj = awayPctg;
  const homeAdj = homePctg * 1.05;
  return awayAdj / (awayAdj + homeAdj);
}

export function runMonteCarlo(standings, games, overrides) {
  // Pre-compute strength (pointPctg) per team — fixed for the whole simulation
  const strength = {};
  for (const team of standings) {
    strength[team.teamAbbrev?.default] = team.pointPctg ?? 0.5;
  }

  // Count how many times each team makes the playoffs across all sims
  const playoffCounts = {};
  for (const team of standings) {
    playoffCounts[team.teamAbbrev?.default] = 0;
  }

  for (let sim = 0; sim < NUM_SIMS; sim++) {
    // Clone only the fields the playoff engine reads
    const simStandings = standings.map((t) => ({
      teamAbbrev: t.teamAbbrev,
      conferenceName: t.conferenceName,
      divisionName: t.divisionName,
      points: t.points,
      wins: t.wins,
      losses: t.losses,
      otLosses: t.otLosses,
      regulationWins: t.regulationWins,
      regulationPlusOtWins: t.regulationPlusOtWins,
      gamesPlayed: t.gamesPlayed,
    }));

    // Build a lookup map for fast access
    const byAbbrev = {};
    for (const t of simStandings) byAbbrev[t.teamAbbrev?.default] = t;

    for (const game of games) {
      const away = byAbbrev[game.awayTeam.abbrev];
      const home = byAbbrev[game.homeTeam.abbrev];
      if (!away || !home) continue;

      const override = overrides[game.id];
      let awayWins, isOT;

      if (override === 'away') {
        awayWins = true;
        isOT = false;
      } else if (override === 'home') {
        awayWins = false;
        isOT = false;
      } else {
        const prob = getAwayWinProb(
          strength[game.awayTeam.abbrev] ?? 0.5,
          strength[game.homeTeam.abbrev] ?? 0.5
        );
        awayWins = Math.random() < prob;
        isOT = Math.random() < OT_RATE;
      }

      const [winner, loser] = awayWins ? [away, home] : [home, away];
      winner.points += 2;
      winner.wins += 1;
      winner.regulationWins += isOT ? 0 : 1;
      winner.regulationPlusOtWins += 1;
      winner.gamesPlayed += 1;
      loser.points += isOT ? 1 : 0;
      if (isOT) loser.otLosses += 1;
      else loser.losses += 1;
      loser.gamesPlayed += 1;
    }

    const playoffTeams = computePlayoffTeams(simStandings);
    for (const abbrev of playoffTeams) {
      if (abbrev in playoffCounts) playoffCounts[abbrev]++;
    }
  }

  // Return odds as 0–1 fractions
  const odds = {};
  for (const [abbrev, count] of Object.entries(playoffCounts)) {
    odds[abbrev] = count / NUM_SIMS;
  }
  return odds;
}
