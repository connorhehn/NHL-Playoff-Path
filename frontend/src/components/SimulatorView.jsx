import { useState } from 'react';
import SimulatorHero from './SimulatorHero';
import TeamPicker from './TeamPicker';
import TeamGames from './TeamGames';
import OddsTable from './OddsTable';

export default function SimulatorView({ standings, playoffPicture, simulator }) {
  const { games, overrides, odds, loadingGames, overrideCount, toggleOverride, resetOverrides } = simulator;
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <div className="space-y-6">
      <SimulatorHero overrideCount={overrideCount} onReset={resetOverrides} />

      {loadingGames ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 text-sm">Loading remaining schedule...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: team picker + focused game list */}
          <div className="space-y-4">
            <TeamPicker
              standings={standings}
              games={games}
              overrides={overrides}
              selectedAbbrev={selectedTeam}
              onSelect={setSelectedTeam}
            />
            {selectedTeam && (
              <TeamGames
                abbrev={selectedTeam}
                games={games}
                overrides={overrides}
                onToggle={toggleOverride}
                odds={odds}
                teamStanding={standings.find((t) => t.teamAbbrev?.default === selectedTeam)}
              />
            )}
            {!selectedTeam && (
              <p className="text-center text-slate-600 text-sm py-4">
                Select a team above to set their game outcomes.
              </p>
            )}
          </div>

          {/* Right: playoff odds */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
              Playoff Odds
            </h3>
            <OddsTable playoffPicture={playoffPicture} odds={odds} />
          </div>
        </div>
      )}
    </div>
  );
}
