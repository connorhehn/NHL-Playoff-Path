import { useState } from 'react';
import Header from './components/Header';
import TabNav from './components/TabNav';
import ConferenceView from './components/ConferenceView';
import SimulatorView from './components/SimulatorView';
import { useStandings } from './hooks/useStandings';
import { useSimulator } from './hooks/useSimulator';
import './index.css';

const CONFERENCE_ORDER = ['Eastern', 'Western'];

export default function App() {
  const [activeTab, setActiveTab] = useState('standings');
  const { standings, playoffPicture, updatedAt, loading, error } = useStandings();
  const simulator = useSimulator(standings);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header updatedAt={updatedAt} />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 text-sm">Loading live standings...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <p className="text-red-400 text-sm">Failed to load standings: {error}</p>
            <p className="text-slate-500 text-xs mt-2">The NHL API may be temporarily unavailable.</p>
          </div>
        )}

        {!loading && !error && playoffPicture && (
          <>
            {activeTab === 'standings' && (
              <div className="space-y-12">
                {CONFERENCE_ORDER.filter((c) => playoffPicture[c]).map((confName) => (
                  <ConferenceView
                    key={confName}
                    confName={confName}
                    confData={playoffPicture[confName]}
                  />
                ))}
              </div>
            )}

            {activeTab === 'simulator' && (
              <SimulatorView
                standings={standings}
                playoffPicture={playoffPicture}
                simulator={simulator}
              />
            )}
          </>
        )}
      </main>

      <footer className="border-t border-slate-800 mt-16 px-6 py-6">
        <p className="text-center text-slate-600 text-xs">
          Data provided by the NHL API · Not affiliated with the NHL
        </p>
      </footer>
    </div>
  );
}
