export default function SimulatorHero({ overrideCount, onReset }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-1">
        Build your own NHL playoff path.
      </h2>
      <p className="text-slate-400 text-sm mb-4">
        Toggle wins and losses for every remaining regular-season game and watch
        standings, wild-card races, and playoff odds reshape instantly.
      </p>

      <div className="flex flex-wrap gap-4 mb-5 text-sm">
        <span className="flex items-center gap-2 text-slate-300">
          <span className="text-lg">📊</span> Monte Carlo simulations
        </span>
        <span className="flex items-center gap-2 text-slate-300">
          <span className="text-lg">🎯</span> Interactive scenarios
        </span>
        <span className="flex items-center gap-2 text-slate-300">
          <span className="text-lg">⚡</span> Instant recalculation
        </span>
      </div>

      <div className="border-t border-slate-700 pt-4 space-y-2 text-sm text-slate-400">
        <p><span className="text-slate-200 font-medium">1</span> — Click <span className="bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono text-xs">W</span> or <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono text-xs">L</span> on any upcoming matchup to set the outcome</p>
        <p><span className="text-slate-200 font-medium">2</span> — Watch playoff odds recalculate instantly across all 32 teams</p>
        <p><span className="text-slate-200 font-medium">3</span> — Click the same button again to reset that game to undecided</p>
      </div>

      {overrideCount > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-sky-400">
            {overrideCount} game{overrideCount !== 1 ? 's' : ''} set
          </span>
          <button
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline"
          >
            Reset all
          </button>
        </div>
      )}
    </div>
  );
}
