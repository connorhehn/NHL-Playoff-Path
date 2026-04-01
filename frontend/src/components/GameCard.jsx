import TeamLogo from './TeamLogo';

function formatShortDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Single game row rendered from a specific team's perspective.
// teamSide: 'away' | 'home' — which side this team is on
export default function GameCard({ game, teamSide, override, onToggle }) {
  const opponentSide = teamSide === 'away' ? 'home' : 'away';
  const opponent = teamSide === 'away' ? game.homeTeam : game.awayTeam;
  const isHome = teamSide === 'home';
  const teamWins = override === teamSide;
  const teamLoses = override === opponentSide;

  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-colors ${
      override ? 'border-slate-700 bg-slate-800/50' : 'border-slate-800/60 bg-slate-900/30'
    }`}>
      {/* W / L buttons */}
      <div className="flex gap-1 flex-shrink-0">
        <button
          onClick={() => onToggle(game.id, teamSide)}
          className={`w-7 h-6 rounded text-xs font-bold transition-colors ${
            teamWins
              ? 'bg-sky-500 text-white'
              : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-white'
          }`}
        >
          W
        </button>
        <button
          onClick={() => onToggle(game.id, opponentSide)}
          className={`w-7 h-6 rounded text-xs font-bold transition-colors ${
            teamLoses
              ? 'bg-red-500/80 text-white'
              : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-white'
          }`}
        >
          L
        </button>
      </div>

      {/* @/vs + opponent */}
      <span className="text-slate-600 text-xs flex-shrink-0">{isHome ? 'vs' : '@'}</span>
      <TeamLogo src={opponent.logo} abbrev={opponent.abbrev} className="w-5 h-5 object-contain flex-shrink-0" />
      <span className={`font-semibold flex-1 transition-colors ${teamLoses ? 'text-slate-600' : 'text-white'}`}>
        {opponent.abbrev}
      </span>

      {/* Date */}
      <span className="text-slate-600 text-xs flex-shrink-0">{formatShortDate(game.date)}</span>
    </div>
  );
}
