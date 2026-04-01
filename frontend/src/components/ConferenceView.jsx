import DivisionTable from './DivisionTable';
import PlayoffBracket from './PlayoffBracket';

export default function ConferenceView({ confName, confData }) {
  const { divisions, wildcards } = confData;

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">
        <span className="text-sky-400">{confName}</span> Conference
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {Object.entries(divisions).map(([divName, { teams, inCount }]) => (
          <DivisionTable
            key={divName}
            divisionName={divName}
            teams={teams}
            inCount={inCount}
            wildcards={wildcards}
          />
        ))}
      </div>

      <PlayoffBracket confName={confName} confData={confData} />
    </section>
  );
}
