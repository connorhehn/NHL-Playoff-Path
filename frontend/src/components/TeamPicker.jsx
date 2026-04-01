import TeamLogo from './TeamLogo';

const CONFERENCE_ORDER = ['Eastern', 'Western'];

export default function TeamPicker({ standings, games, overrides, selectedAbbrev, onSelect }) {
  // Count set games per team
  const setCounts = {};
  for (const game of games) {
    if (!overrides[game.id]) continue;
    const winner = overrides[game.id] === 'away' ? game.awayTeam.abbrev : game.homeTeam.abbrev;
    const loser = overrides[game.id] === 'away' ? game.homeTeam.abbrev : game.awayTeam.abbrev;
    setCounts[winner] = (setCounts[winner] ?? 0) + 1;
    setCounts[loser] = (setCounts[loser] ?? 0) + 1;
  }

  // Count remaining games per team
  const gameCounts = {};
  for (const game of games) {
    gameCounts[game.awayTeam.abbrev] = (gameCounts[game.awayTeam.abbrev] ?? 0) + 1;
    gameCounts[game.homeTeam.abbrev] = (gameCounts[game.homeTeam.abbrev] ?? 0) + 1;
  }

  // Group by conference
  const byConf = {};
  for (const team of standings) {
    const conf = team.conferenceName;
    if (!byConf[conf]) byConf[conf] = [];
    byConf[conf].push(team);
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800">
        <p className="text-sm font-semibold text-slate-300">Select a team to set their remaining games</p>
      </div>
      {CONFERENCE_ORDER.filter((c) => byConf[c]).map((conf) => (
        <div key={conf} className="border-b border-slate-800 last:border-0">
          <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-900/60">
            {conf}
          </p>
          <div className="grid grid-cols-8 sm:grid-cols-8 gap-1 p-2">
            {byConf[conf]
              .sort((a, b) => b.points - a.points)
              .map((team) => {
                const abbrev = team.teamAbbrev?.default;
                const isSelected = abbrev === selectedAbbrev;
                const hasSet = setCounts[abbrev] > 0;
                const remaining = gameCounts[abbrev] ?? 0;

                return (
                  <button
                    key={abbrev}
                    onClick={() => onSelect(isSelected ? null : abbrev)}
                    className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-sky-500/20 border border-sky-500/50'
                        : 'border border-transparent hover:bg-slate-800'
                    }`}
                  >
                    <TeamLogo
                      src={team.teamLogo}
                      abbrev={abbrev}
                      className={`w-8 h-8 object-contain transition-opacity ${
                        remaining === 0 ? 'opacity-30' : ''
                      }`}
                    />
                    <span className={`text-xs font-bold leading-none ${isSelected ? 'text-sky-400' : 'text-slate-400'}`}>
                      {abbrev}
                    </span>
                    {remaining > 0 && (
                      <span className="text-slate-600 text-xs leading-none">{remaining}G</span>
                    )}
                    {hasSet && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-sky-400" />
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
