export default function AboutModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-600 rounded-2xl max-w-md w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-white">About</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed">
          NHL Playoff Path is a personal project built to make it easy to visualize the
          current NHL playoff picture and simulate what-if scenarios for the rest of the
          regular season.
        </p>

        <p className="text-slate-300 text-sm leading-relaxed">
          Toggle wins and losses for any remaining game and watch playoff odds recalculate
          instantly across all 32 teams using Monte Carlo simulations.
        </p>

        <div className="border-t border-slate-700 pt-4 space-y-1 text-sm">
          <p className="text-slate-400">
            Built by{' '}
            <a
              href="https://github.com/connorhehn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              Connor Hehn
            </a>
          </p>
          <p className="text-slate-600 text-xs">
            Data provided by the NHL API · Not affiliated with the NHL
          </p>
          <p className="text-slate-600 text-xs">
            Inspired by{' '}
            <a
              href="https://www.nflplayoffpath.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-400 transition-colors"
            >
              nflplayoffpath.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
