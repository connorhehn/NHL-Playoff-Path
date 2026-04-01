import TeamLogo from './TeamLogo';

function OddsBar({ pct }) {
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

function ConferenceOdds({ confName, confData, odds }) {
  // Flatten all teams from both divisions, sorted by current points
  const allTeams = Object.values(confData.divisions)
    .flatMap(({ teams }) => teams)
    .sort((a, b) => b.points - a.points);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-800">
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
              className={`flex items-center gap-3 px-4 py-2.5 ${isIn ? 'bg-slate-800/30' : ''}`}
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
