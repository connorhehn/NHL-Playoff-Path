function SeedSlot({ seed, team, label, isWildCard }) {
  if (!team) return null;
  const abbrev = team.teamAbbrev?.default ?? '';
  const logo = team.teamLogo;
  const pts = team.points;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
        isWildCard
          ? 'border-purple-500/40 bg-purple-900/10'
          : 'border-slate-700 bg-slate-800/50'
      }`}
    >
      <span className="text-slate-500 text-xs font-bold w-4 text-center">{seed}</span>
      {logo && <img src={logo} alt={abbrev} className="w-5 h-5 object-contain" />}
      <span className="font-semibold text-white text-sm flex-1">{abbrev}</span>
      <span className="text-slate-400 text-xs">{pts} pts</span>
    </div>
  );
}

function Matchup({ top, bottom }) {
  if (!top || !bottom) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <SeedSlot {...top} isWildCard={top.label?.includes('Wild')} />
      <SeedSlot {...bottom} isWildCard={bottom.label?.includes('Wild')} />
    </div>
  );
}

export default function PlayoffBracket({ confName, confData }) {
  const { matchups } = confData;
  const [topBracket, bottomBracket] = [matchups.slice(0, 2), matchups.slice(2, 4)];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800">
        <h3 className="font-bold text-white text-sm tracking-wide uppercase">
          {confName} Conference · First Round
        </h3>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...topBracket, ...bottomBracket].map((m, i) => (
          <Matchup key={i} top={m.top} bottom={m.bottom} />
        ))}
      </div>
    </div>
  );
}
