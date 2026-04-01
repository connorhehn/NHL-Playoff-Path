export default function SimulatorHero({ overrideCount, onReset }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-1">
        Build your own NHL playoff path.
      </h2>
      <p className="text-slate-400 text-sm mb-4">
        Toggle game outcomes for every remaining regular-season game and watch
        playoff odds reshape instantly across all 32 teams.
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
        <p><span className="text-slate-200 font-medium">1</span> — Select a team, then click <span className="bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono text-xs">W</span> <span className="bg-sky-400/20 text-sky-300 px-1.5 py-0.5 rounded font-mono text-xs">OTW</span> <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono text-xs">OTL</span> <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono text-xs">L</span> on any upcoming matchup to set the outcome</p>
        <p><span className="text-slate-200 font-medium">2</span> — Watch playoff odds recalculate instantly across all 32 teams</p>
        <p><span className="text-slate-200 font-medium">3</span> — Click the same button again to clear that game</p>
      </div>

      <div className="border-t border-slate-700 pt-4 mt-4 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Scoring</p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono text-xs">W</span>
              <span className="text-slate-500 text-xs">2 pts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-sky-400/20 text-sky-300 px-1.5 py-0.5 rounded font-mono text-xs">OTW</span>
              <span className="text-slate-500 text-xs">2 pts · opponent gets 1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono text-xs">OTL</span>
              <span className="text-slate-500 text-xs">1 pt · opponent gets 2</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono text-xs">L</span>
              <span className="text-slate-500 text-xs">0 pts</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Playoff Seeding</p>
          <div className="space-y-1.5 text-xs text-slate-500">
            <p>Top <span className="text-slate-300">3 teams</span> per division earn automatic berths</p>
            <p>Next <span className="text-slate-300">2 teams</span> per conference claim wild card spots</p>
            <p className="text-slate-600">Tiebreaker: points → regulation wins → ROW</p>
          </div>
        </div>
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
