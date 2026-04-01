export default function OddsBar({ pct }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            pct >= 0.9 ? 'bg-green-500' : pct >= 0.5 ? 'bg-sky-500' : pct > 0 ? 'bg-slate-500' : 'bg-transparent'
          }`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-10 text-right tabular-nums ${
        pct >= 0.9 ? 'text-green-400' : pct >= 0.5 ? 'text-sky-400' : pct > 0 ? 'text-slate-400' : 'text-slate-700'
      }`}>
        {pct > 0 ? `${Math.round(pct * 100)}%` : '—'}
      </span>
    </div>
  );
}
