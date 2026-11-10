// NHL seasons start in the fall: Jul–Dec belongs to the season starting this year.
function currentSeasonLabel(now = new Date()) {
  const startYear = now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1;
  return `${startYear}–${String(startYear + 1).slice(-2)}`;
}

export default function Header({ updatedAt }) {
  const formatted = updatedAt
    ? new Date(updatedAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : null;

  return (
    <header className="border-b border-slate-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black tracking-tight text-white">
            NHL
            <span className="text-sky-400"> Playoff</span>
            <span className="text-slate-400"> Path</span>
          </div>
          <span className="hidden sm:inline-block text-xs bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full px-2 py-0.5 font-medium">
            {currentSeasonLabel()}
          </span>
        </div>
        <div className="text-right">
          {formatted ? (
            <p className="text-slate-400 text-xs">
              Updated <span className="text-slate-300">{formatted}</span>
            </p>
          ) : (
            <p className="text-slate-600 text-xs hidden sm:block">Live via NHL API</p>
          )}
        </div>
      </div>
    </header>
  );
}
