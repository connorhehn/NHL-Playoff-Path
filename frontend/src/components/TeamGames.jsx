import GameCard from './GameCard';

export default function TeamGames({ abbrev, games, overrides, onToggle }) {
  const teamGames = games
    .filter((g) => g.awayTeam.abbrev === abbrev || g.homeTeam.abbrev === abbrev)
    .map((g) => ({
      game: g,
      teamSide: g.awayTeam.abbrev === abbrev ? 'away' : 'home',
    }));

  if (teamGames.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl border border-slate-800 px-4 py-8 text-center text-slate-500 text-sm">
        No remaining games for {abbrev}.
      </div>
    );
  }

  const setCount = teamGames.filter(({ game }) => overrides[game.id]).length;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <p className="text-sm font-semibold text-white">
          {abbrev} · {teamGames.length} remaining game{teamGames.length !== 1 ? 's' : ''}
        </p>
        {setCount > 0 && (
          <span className="text-xs text-sky-400">{setCount} set</span>
        )}
      </div>
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
}
