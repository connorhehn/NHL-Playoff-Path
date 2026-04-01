import TeamRow from './TeamRow';

export default function DivisionTable({ divisionName, teams, inCount, wildcards }) {
  const wildcardAbbrevs = new Set((wildcards ?? []).map((t) => t.teamAbbrev?.default));

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <h3 className="font-bold text-white text-sm tracking-wide uppercase">{divisionName}</h3>
        <div className="flex gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> In playoffs
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Wild card
          </span>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-xs text-slate-500 border-b border-slate-700">
            <th className="py-2 pl-3 pr-1 text-left w-6">#</th>
            <th className="py-2 px-2 text-left">Team</th>
            <th className="py-2 px-2 text-center">GP</th>
            <th className="py-2 px-2 text-center">PTS</th>
            <th className="py-2 px-2 text-center">W–L–OT</th>
            <th className="py-2 px-2 text-center hidden md:table-cell">L10</th>
            <th className="py-2 px-3 text-center hidden lg:table-cell">STK</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {teams.map((team, i) => {
            const abbrev = team.teamAbbrev?.default;
            const isIn = i < inCount || wildcardAbbrevs.has(abbrev);
            const isWildCard = wildcardAbbrevs.has(abbrev) && i >= inCount;
            const isBubble = !isIn;
            return (
              <TeamRow
                key={abbrev}
                team={team}
                rank={i + 1}
                isIn={isIn}
                isWildCard={isWildCard}
                isBubble={isBubble}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
