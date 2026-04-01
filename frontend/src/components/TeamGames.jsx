import GameCard from './GameCard';
import TeamLogo from './TeamLogo';
import OddsBar from './OddsBar';

export default function TeamGames({ abbrev, games, overrides, onToggle, odds, teamStanding }) {
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
      {odds && teamStanding && (
        <div className="px-4 py-2.5 border-b border-slate-800 flex items-center gap-3 bg-slate-800/30">
          <TeamLogo src={teamStanding.teamLogo} abbrev={abbrev} className="w-5 h-5 object-contain flex-shrink-0" />
          <span className="text-white text-sm font-semibold w-10">{abbrev}</span>
          <span className="text-slate-500 text-xs w-8 text-right">{teamStanding.points}pt</span>
          <div className="flex-1">
            <OddsBar pct={odds[abbrev] ?? 0} />
          </div>
        </div>
      )}
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
