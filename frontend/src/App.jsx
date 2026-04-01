import { useState } from 'react';
import Header from './components/Header';
import TabNav from './components/TabNav';
import ConferenceView from './components/ConferenceView';
import SimulatorView from './components/SimulatorView';
import AboutModal from './components/AboutModal';
import { useStandings } from './hooks/useStandings';
import { useSimulator } from './hooks/useSimulator';
import './index.css';

const CONFERENCE_ORDER = ['Eastern', 'Western'];

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [showAbout, setShowAbout] = useState(false);
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
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            Data provided by the NHL API · Not affiliated with the NHL
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAbout(true)}
              className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
            >
              About
            </button>
            <a
              href="https://tally.so/r/jaWBQ6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full px-3 py-1.5 transition-colors"
            >
              Leave feedback
            </a>
          </div>
        </div>
      </footer>

{showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}
