/**
 * NHL Playoff Seeding Engine
 *
 * Format: 16 teams (8 per conference)
 * Per conference: top 3 from each division (6 teams) + 2 wild cards
 *
 * Bracket per conference:
 *   Better division winner (more pts) vs WC2
 *   Better division 2nd vs Better division 3rd
 *   Worse division winner vs WC1
 *   Worse division 2nd vs Worse division 3rd
 */

function sortByPoints(teams) {
  return [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.regulationWins !== a.regulationWins) return b.regulationWins - a.regulationWins;
    if (b.regulationPlusOtWins !== a.regulationPlusOtWins)
      return b.regulationPlusOtWins - a.regulationPlusOtWins;
    return b.gamesPlayed - a.gamesPlayed; // fewer GP = better (games in hand)
  });
}

export function computePlayoffPicture(standings) {
  const conferences = {};

  for (const team of standings) {
    const conf = team.conferenceName; // "Eastern" or "Western"
    const div = team.divisionName;
    if (!conferences[conf]) conferences[conf] = {};
    if (!conferences[conf][div]) conferences[conf][div] = [];
    conferences[conf][div].push(team);
  }

  const result = {};

  for (const [confName, divisions] of Object.entries(conferences)) {
    const divNames = Object.keys(divisions);
    const [divAName, divBName] = divNames;

    const divA = sortByPoints(divisions[divAName]);
    const divB = sortByPoints(divisions[divBName]);

    // Top 3 from each division qualify automatically
    const divAIn = divA.slice(0, 3);
    const divBIn = divB.slice(0, 3);
    const divAOut = divA.slice(3);
    const divBOut = divB.slice(3);

    // Wild cards: best 2 remaining teams in conference by points
    const wildcardPool = sortByPoints([...divAOut, ...divBOut]);
    const wildcards = wildcardPool.slice(0, 2);
    const bubble = wildcardPool.slice(2);

    // Determine which division winner has more points (better seed)
    const divAWinner = divAIn[0];
    const divBWinner = divBIn[0];

    let topDiv, bottomDiv, topDivName, bottomDivName;
    if (divAWinner.points >= divBWinner.points) {
      topDiv = divAIn;
      bottomDiv = divBIn;
      topDivName = divAName;
      bottomDivName = divBName;
    } else {
      topDiv = divBIn;
      bottomDiv = divAIn;
      topDivName = divBName;
      bottomDivName = divAName;
    }

    // Conference seeds 1-8
    // 1: top div winner, 2: top div 2nd, 3: top div 3rd
    // 4: bottom div winner, 5: bottom div 2nd, 6: bottom div 3rd
    // 7: WC1, 8: WC2
    const seeds = [
      { seed: 1, team: topDiv[0], label: `${topDivName} 1st` },
      { seed: 2, team: topDiv[1], label: `${topDivName} 2nd` },
      { seed: 3, team: topDiv[2], label: `${topDivName} 3rd` },
      { seed: 4, team: bottomDiv[0], label: `${bottomDivName} 1st` },
      { seed: 5, team: bottomDiv[1], label: `${bottomDivName} 2nd` },
      { seed: 6, team: bottomDiv[2], label: `${bottomDivName} 3rd` },
      { seed: 7, team: wildcards[0], label: 'Wild Card 1' },
      { seed: 8, team: wildcards[1], label: 'Wild Card 2' },
    ];

    // First-round matchups
    // Top div bracket: 1 vs 8, 2 vs 3
    // Bottom div bracket: 4 vs 7, 5 vs 6
    const matchups = [
      { top: seeds[0], bottom: seeds[7] }, // 1 vs 8
      { top: seeds[1], bottom: seeds[2] }, // 2 vs 3
      { top: seeds[3], bottom: seeds[6] }, // 4 vs 7
      { top: seeds[4], bottom: seeds[5] }, // 5 vs 6
    ];

    result[confName] = {
      seeds,
      matchups,
      divisions: {
        [topDivName]: { teams: divA, inCount: 3 },
        [bottomDivName]: { teams: divB, inCount: 3 },
      },
      wildcards,
      bubble: bubble.slice(0, 4),
    };
  }

  return result;
}
