export default function TabNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'standings', label: 'Standings' },
    { id: 'simulator', label: 'Simulator' },
  ];

  return (
    <div className="border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-sky-400 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
