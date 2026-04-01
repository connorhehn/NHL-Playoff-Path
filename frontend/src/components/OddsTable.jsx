import TeamLogo from './TeamLogo';
import OddsBar from './OddsBar';

function ConferenceOdds({ confName, confData, odds }) {
  // Flatten all teams from both divisions, sorted by current points
  const allTeams = Object.values(confData.divisions)
    .flatMap(({ teams }) => teams)
    .sort((a, b) => b.points - a.points);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700">
        <h3 className="font-bold text-white text-sm tracking-wide uppercase">
          {confName} Conference
        </h3>
      </div>
      <div className="divide-y divide-slate-800/50">
        {allTeams.map((team, i) => {
          const abbrev = team.teamAbbrev?.default ?? '';
          const pct = odds[abbrev] ?? 0;
          const isIn = confData.seeds.some((s) => s.team?.teamAbbrev?.default === abbrev);
          return (
            <div
              key={abbrev}
              className={`flex items-center gap-3 px-4 py-2.5 ${isIn ? 'bg-slate-700/40' : ''}`}
            >
              <span className="text-slate-600 text-xs w-4">{i + 1}</span>
              <TeamLogo src={team.teamLogo} abbrev={abbrev} className="w-5 h-5 object-contain flex-shrink-0" />
              <span className="text-white text-sm font-semibold w-10">{abbrev}</span>
              <span className="text-slate-500 text-xs w-8 text-right">{team.points}pt</span>
              <div className="flex-1">
                <OddsBar pct={pct} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OddsTable({ playoffPicture, odds }) {
  if (!playoffPicture) return null;
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Playoff odds from {(5000).toLocaleString()} Monte Carlo simulations
      </p>
      {['Eastern', 'Western']
        .filter((c) => playoffPicture[c])
        .map((confName) => (
          <ConferenceOdds
            key={confName}
            confName={confName}
            confData={playoffPicture[confName]}
            odds={odds}
          />
        ))}
    </div>
  );
}
