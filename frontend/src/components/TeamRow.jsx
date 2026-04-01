import TeamLogo from './TeamLogo';

const CLINCH_LABELS = {
  e: { label: 'E', title: 'Eliminated', color: 'bg-red-900/60 text-red-400' },
  x: { label: 'X', title: 'Clinched Playoff Berth', color: 'bg-green-900/60 text-green-400' },
  y: { label: 'Y', title: 'Clinched Division', color: 'bg-sky-900/60 text-sky-400' },
  z: { label: 'Z', title: 'Clinched Presidents\' Trophy', color: 'bg-yellow-900/60 text-yellow-400' },
  p: { label: 'P', title: 'Clinched Playoff Berth', color: 'bg-green-900/60 text-green-400' },
};

export default function TeamRow({ team, rank, isIn, isWildCard, isBubble }) {
  const abbrev = team.teamAbbrev?.default ?? '';
  const name = team.teamCommonName?.default ?? team.teamName?.default ?? abbrev;
  const logo = team.teamLogo;
  const clinchKey = team.clinchIndicator?.toLowerCase();
  const clinch = clinchKey ? CLINCH_LABELS[clinchKey] : null;

  const rowBg = isIn
    ? 'bg-slate-800/40'
    : isBubble
    ? 'bg-slate-900/20'
    : '';

  const borderLeft = isIn
    ? isWildCard
      ? 'border-l-2 border-l-purple-500'
      : 'border-l-2 border-l-sky-500'
    : 'border-l-2 border-l-transparent';

  return (
    <tr className={`${rowBg} hover:bg-slate-800/60 transition-colors`}>
      <td className={`py-2 pl-3 pr-1 text-slate-400 text-sm w-6 ${borderLeft}`}>{rank}</td>
      <td className="py-2 px-2">
        <div className="flex items-center gap-2">
          <TeamLogo src={logo} abbrev={abbrev} className="w-6 h-6 object-contain flex-shrink-0" />
          <span className="font-semibold text-white text-sm">{abbrev}</span>
          <span className="text-slate-400 text-sm hidden sm:inline">{name}</span>
          {clinch && (
            <span
              className={`text-xs font-bold px-1 rounded ${clinch.color}`}
              title={clinch.title}
            >
              {clinch.label}
            </span>
          )}
        </div>
      </td>
      <td className="py-2 px-2 text-center text-sm text-slate-300">{team.gamesPlayed}</td>
      <td className="py-2 px-2 text-center text-sm font-bold text-white">{team.points}</td>
      <td className="py-2 px-2 text-center text-sm text-slate-300">
        {team.wins}–{team.losses}–{team.otLosses}
      </td>
      <td className="py-2 px-2 text-center text-sm text-slate-400 hidden md:table-cell">
        {team.l10Wins}–{team.l10Losses}–{team.l10OtLosses}
      </td>
      <td className="py-2 px-3 text-center text-sm hidden lg:table-cell">
        <span
          className={
            team.streakCode === 'W'
              ? 'text-green-400'
              : team.streakCode === 'L'
              ? 'text-red-400'
              : 'text-yellow-400'
          }
        >
          {team.streakCode}{team.streakCount}
        </span>
      </td>
    </tr>
  );
}
