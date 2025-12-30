import React, { useState } from 'react';
import { Database, Split, Network, AlertTriangle, Disc, BookOpen, Layers } from 'lucide-react';
import { TabId, NavItem } from './types';
import ConceptTab from './tabs/ConceptTab';
import StrategiesTab from './tabs/StrategiesTab';
import RoutingTab from './tabs/RoutingTab';
import RebalancingTab from './tabs/RebalancingTab';
import ConsistentHashingTab from './tabs/ConsistentHashingTab';
import QuizTab from './tabs/QuizTab';

const navItems: NavItem[] = [
  { id: TabId.CONCEPT, label: 'Concept', icon: <Database size={18} /> },
  { id: TabId.STRATEGIES, label: 'Strategies', icon: <Split size={18} /> },
  { id: TabId.ROUTING, label: 'Routing', icon: <Network size={18} /> },
  { id: TabId.CHALLENGES, label: 'Challenges', icon: <AlertTriangle size={18} /> },
  { id: TabId.CONSISTENT, label: 'Consistent Hashing', icon: <Disc size={18} /> },
  { id: TabId.QUIZ, label: 'Quiz', icon: <BookOpen size={18} /> },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.CONCEPT);

  const renderContent = () => {
    switch (activeTab) {
      case TabId.CONCEPT: return <ConceptTab />;
      case TabId.STRATEGIES: return <StrategiesTab />;
      case TabId.ROUTING: return <RoutingTab />;
      case TabId.CHALLENGES: return <RebalancingTab />;
      case TabId.CONSISTENT: return <ConsistentHashingTab />;
      case TabId.QUIZ: return <QuizTab />;
      default: return <ConceptTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
                <Layers className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">ShardMaster</h1>
                <p className="text-xs text-blue-400 font-medium">System Design Interactive</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center text-xs text-slate-500">
               Interactive Learning Module v1.0
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 overflow-x-auto pb-0 no-scrollbar">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`
                                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap
                                ${isActive 
                                    ? 'border-blue-500 text-blue-400 bg-slate-800/50 rounded-t-lg' 
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'}
                            `}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-8 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
              <p>Designed for Developers Learning System Design</p>
          </div>
      </footer>
    </div>
  );
};

export default App;