import React, { useState } from 'react';
import { Search, Server, ArrowRight, User, Calendar } from 'lucide-react';
import { DatabaseCylinder, ServerRack } from '../components/DatabaseVisuals';

const RoutingTab: React.FC = () => {
  const [activePath, setActivePath] = useState<'A' | 'B' | 'ALL' | null>(null);
  const [log, setLog] = useState<string>("Ready for query...");
  const [latency, setLatency] = useState<string>("--");

  const handleSearch = (term: string) => {
    setActivePath(null);
    setLog("Router analyzing query...");
    setLatency("--");

    setTimeout(() => {
        if (term.toLowerCase() === 'alice') {
            setActivePath('A');
            setLog("Key 'Alice' begins with A-M -> Direct Route to Shard A");
            setLatency("5ms");
        } else if (term.toLowerCase() === 'zack') {
            setActivePath('B');
            setLog("Key 'Zack' begins with N-Z -> Direct Route to Shard B");
            setLatency("5ms");
        } else if (term.includes('25')) {
            setActivePath('ALL');
            setLog("Query has no Shard Key (Age). Scatter-Gather: Broadcasting to ALL shards.");
            setLatency("50ms (Slow)");
        }
    }, 600);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">The Routing Layer</h2>
        <p className="text-slate-400">
            The application shouldn't know about shards. A <strong>Router</strong> sits in the middle. 
            If you provide the "Shard Key", it's fast. If you don't, it has to ask everyone ("Scatter-Gather").
        </p>
      </div>

      {/* Interactive Stage */}
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 flex flex-col items-center gap-12">
        
        {/* Step 1: Client / Search */}
        <div className="w-full max-w-md relative z-10">
            <div className="flex gap-2 mb-4 justify-center">
                <button 
                    onClick={() => handleSearch('Alice')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200"
                >
                    <User size={14} className="text-blue-400"/> Search "Alice"
                </button>
                <button 
                     onClick={() => handleSearch('Zack')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200"
                >
                    <User size={14} className="text-green-400"/> Search "Zack"
                </button>
                <button 
                     onClick={() => handleSearch('Age: 25')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200"
                >
                    <Calendar size={14} className="text-yellow-400"/> Search "Age: 25"
                </button>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 font-mono text-sm text-green-400 min-h-[80px]">
                <div className="text-slate-500 text-xs uppercase mb-1">Router Log</div>
                {log}
                <div className="mt-2 text-white font-bold">Latency: {latency}</div>
            </div>
        </div>

        {/* Step 2: The Router */}
        <div className="relative">
             {/* Lines */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[100px] -z-10">
                 {/* Left Leg */}
                 <div className={`absolute top-0 left-0 w-[50%] h-full border-b-2 border-l-2 rounded-bl-3xl transition-colors duration-500
                    ${activePath === 'A' || activePath === 'ALL' ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-slate-700'}`} 
                    style={{ transform: 'skewX(10deg)' }}
                 />
                 {/* Right Leg */}
                 <div className={`absolute top-0 right-0 w-[50%] h-full border-b-2 border-r-2 rounded-br-3xl transition-colors duration-500
                    ${activePath === 'B' || activePath === 'ALL' ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'border-slate-700'}`}
                    style={{ transform: 'skewX(-10deg)' }}
                 />
             </div>

             <div className="bg-slate-800 p-4 rounded-full border-4 border-slate-600 z-10 shadow-xl">
                 <ServerRack active={activePath !== null} />
             </div>
        </div>

        {/* Step 3: The Shards */}
        <div className="flex gap-24 items-start pt-8">
            <div className="flex flex-col items-center">
                 <DatabaseCylinder 
                    load={45} 
                    status="healthy" 
                    label="Shard A" 
                    subLabel="Users A-M" 
                    highlight={activePath === 'A' || activePath === 'ALL'}
                 />
                 {(activePath === 'A' || activePath === 'ALL') && (
                     <div className="mt-2 text-xs font-bold text-green-400 animate-pulse">MATCH FOUND</div>
                 )}
            </div>
            <div className="flex flex-col items-center">
                 <DatabaseCylinder 
                    load={45} 
                    status="healthy" 
                    label="Shard B" 
                    subLabel="Users N-Z"
                    highlight={activePath === 'B' || activePath === 'ALL'}
                 />
                 {(activePath === 'B' || activePath === 'ALL') && (
                     <div className="mt-2 text-xs font-bold text-green-400 animate-pulse">MATCH FOUND</div>
                 )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default RoutingTab;