import TeamLogo from './TeamLogo';

function formatShortDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// Override values per game:
//   'away'   — away wins regulation  (away +2, home +0)
//   'awayOT' — away wins OT          (away +2, home +1)
//   'homeOT' — home wins OT          (home +2, away +1)
//   'home'   — home wins regulation  (home +2, away +0)
//
// From teamSide's perspective:
//   W   → teamSide
//   OTW → teamSideOT
//   OTL → opponentSideOT
//   L   → opponentSide

export default function GameCard({ game, teamSide, override, onToggle }) {
  const opponentSide = teamSide === 'away' ? 'home' : 'away';
  const opponent = teamSide === 'away' ? game.homeTeam : game.awayTeam;
  const isHome = teamSide === 'home';

  const teamWins  = override === teamSide;
  const teamOTW   = override === `${teamSide}OT`;
  const teamOTL   = override === `${opponentSide}OT`;
  const teamLoses = override === opponentSide;

  const dimOpponent = teamWins || teamOTW;

  const btnBase = 'h-6 rounded text-xs font-bold transition-colors px-1.5';
  const btnOff  = `${btnBase} bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-white`;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
      override ? 'border-slate-700 bg-slate-800/50' : 'border-slate-800/60 bg-slate-900/30'
    }`}>
      {/* W / OTW / OTL / L buttons */}
      <div className="flex gap-1 flex-shrink-0">
        <button
          onClick={() => onToggle(game.id, teamSide)}
          className={teamWins ? `${btnBase} bg-sky-500 text-white` : btnOff}
        >
          W
        </button>
        <button
          onClick={() => onToggle(game.id, `${teamSide}OT`)}
          className={teamOTW ? `${btnBase} bg-sky-400/70 text-white` : btnOff}
        >
          OTW
        </button>
        <button
          onClick={() => onToggle(game.id, `${opponentSide}OT`)}
          className={teamOTL ? `${btnBase} bg-amber-500/80 text-white` : btnOff}
        >
          OTL
        </button>
        <button
          onClick={() => onToggle(game.id, opponentSide)}
          className={teamLoses ? `${btnBase} bg-red-500/80 text-white` : btnOff}
        >
          L
        </button>
      </div>

      {/* @/vs + opponent */}
      <span className="text-slate-600 text-xs flex-shrink-0">{isHome ? 'vs' : '@'}</span>
      <TeamLogo src={opponent.logo} abbrev={opponent.abbrev} className="w-5 h-5 object-contain flex-shrink-0" />
      <span className={`font-semibold flex-1 transition-colors ${dimOpponent ? 'text-slate-600' : 'text-white'}`}>
        {opponent.abbrev}
      </span>

      {/* Date */}
      <span className="text-slate-600 text-xs flex-shrink-0">{formatShortDate(game.date)}</span>
    </div>
  );
}
