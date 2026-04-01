import GameCard from './GameCard';
import TeamLogo from './TeamLogo';

export default function GameList({ games, overrides, onToggle, standings }) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        No remaining games found. The regular season may be over.
      </div>
    );
  }

  // Build team metadata lookup from standings for logos
  const teamMeta = {};
  for (const team of standings ?? []) {
    const abbrev = team.teamAbbrev?.default;
    if (abbrev) {
      teamMeta[abbrev] = {
        abbrev,
        name: team.teamCommonName?.default ?? abbrev,
        logo: team.teamLogo,
        conference: team.conferenceName,
        division: team.divisionName,
        points: team.points,
      };
    }
  }

  // Group games by team — each game appears under both teams
  const byTeam = {};
  for (const game of games) {
    const { awayTeam, homeTeam } = game;
    if (!byTeam[awayTeam.abbrev]) byTeam[awayTeam.abbrev] = [];
    if (!byTeam[homeTeam.abbrev]) byTeam[homeTeam.abbrev] = [];
    byTeam[awayTeam.abbrev].push({ game, teamSide: 'away' });
    byTeam[homeTeam.abbrev].push({ game, teamSide: 'home' });
  }

  // Sort teams by conference → division → points desc
  const sortedTeams = Object.keys(byTeam).sort((a, b) => {
    const ta = teamMeta[a];
    const tb = teamMeta[b];
    if (!ta || !tb) return 0;
    if (ta.conference !== tb.conference) return ta.conference.localeCompare(tb.conference);
    if (ta.division !== tb.division) return ta.division.localeCompare(tb.division);
    return tb.points - ta.points;
  });

  // Group sorted teams by conference for section headers
  const conferences = {};
  for (const abbrev of sortedTeams) {
    const conf = teamMeta[abbrev]?.conference ?? 'Unknown';
    if (!conferences[conf]) conferences[conf] = [];
    conferences[conf].push(abbrev);
  }

  return (
    <div className="space-y-6">
      {Object.entries(conferences).map(([confName, teams]) => (
        <div key={confName}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            {confName} Conference
          </p>
          <div className="space-y-4">
            {teams.map((abbrev) => {
              const meta = teamMeta[abbrev];
              const teamGames = byTeam[abbrev];
              const setCount = teamGames.filter(({ game }) => overrides[game.id]).length;

              return (
                <div key={abbrev} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                  {/* Team header */}
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-800/80">
                    <TeamLogo
                      src={meta?.logo}
                      abbrev={abbrev}
                      className="w-5 h-5 object-contain flex-shrink-0"
                    />
                    <span className="text-white font-bold text-sm">{abbrev}</span>
                    <span className="text-slate-500 text-xs">{meta?.name}</span>
                    <span className="ml-auto text-slate-600 text-xs">
                      {teamGames.length} game{teamGames.length !== 1 ? 's' : ''}
                      {setCount > 0 && (
                        <span className="text-sky-500 ml-1">· {setCount} set</span>
                      )}
                    </span>
                  </div>

                  {/* Games */}
                  <div className="p-2 space-y-1">
                    {teamGames.map(({ game, teamSide }) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        teamSide={teamSide}
                        override={overrides[game.id]}
                        onToggle={onToggle}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
