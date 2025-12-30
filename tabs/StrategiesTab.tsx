import React, { useState } from 'react';
import { ArrowDown, Hash, ListOrdered, RefreshCw } from 'lucide-react';
import { DatabaseCylinder, DataPacket } from '../components/DatabaseVisuals';

type Strategy = 'range' | 'hash';
type Item = { id: number; shardIndex: number };

const StrategiesTab: React.FC = () => {
  const [strategy, setStrategy] = useState<Strategy>('range');
  const [items, setItems] = useState<Item[]>([]);
  const [shardLoads, setShardLoads] = useState([0, 0, 0]);
  const [inputValue, setInputValue] = useState<string>('');

  const calculateShard = (id: number, currentStrategy: Strategy): number => {
    if (currentStrategy === 'range') {
      if (id <= 100) return 0; // Shard A
      if (id <= 200) return 1; // Shard B
      return 2;                // Shard C
    } else {
      return id % 3;
    }
  };

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(inputValue);
    if (isNaN(id)) return;

    const shardIndex = calculateShard(id, strategy);
    const newItem = { id, shardIndex };

    setItems([...items, newItem]);
    
    // Update visual loads
    const newLoads = [...shardLoads];
    newLoads[shardIndex] = Math.min(newLoads[shardIndex] + 15, 100);
    setShardLoads(newLoads);
    
    setInputValue('');
  };

  const handleScenario = (type: 'sequential' | 'distributed') => {
    // Reset first
    setItems([]);
    setShardLoads([0,0,0]);

    const demoIds = type === 'sequential' ? [90, 91, 92, 93, 94, 95] : [10, 150, 250, 40, 180, 500];
    
    let currentItems: Item[] = [];
    let currentLoads = [0, 0, 0];

    demoIds.forEach((id, index) => {
        setTimeout(() => {
             const shardIndex = calculateShard(id, strategy);
             currentItems.push({ id, shardIndex });
             currentLoads[shardIndex] = Math.min(currentLoads[shardIndex] + 15, 100);
             
             // We need functional updates for the timeouts to pick up previous state if we weren't rebuilding arrays locally
             // But for simplicity in this demo, we'll force update visible state at the end or use a chain
             setItems([...currentItems]);
             setShardLoads([...currentLoads]);
        }, index * 300);
    });
  };

  const reset = () => {
    setItems([]);
    setShardLoads([0, 0, 0]);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Sharding Strategies: Key Based</h2>
        <p className="text-slate-400">
          How do we decide where data lives? The "Shard Key" determines the destination.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit">
          <div className="mb-6">
             <label className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 block">Select Strategy</label>
             <div className="flex gap-2 p-1 bg-slate-900 rounded-lg">
               <button 
                onClick={() => { setStrategy('range'); reset(); }}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-colors ${strategy === 'range' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 <ListOrdered size={16} /> Range
               </button>
               <button 
                onClick={() => { setStrategy('hash'); reset(); }}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-colors ${strategy === 'hash' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 <Hash size={16} /> Hash
               </button>
             </div>
          </div>

          <div className="mb-6 bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300">
             {strategy === 'range' ? (
               <ul className="space-y-1">
                 <li className="text-green-400 font-mono">ID 000-100 → Shard A</li>
                 <li className="text-green-400 font-mono">ID 101-200 → Shard B</li>
                 <li className="text-green-400 font-mono">ID 201+    → Shard C</li>
                 <li className="mt-2 text-xs italic text-slate-500">Good for range queries, bad for sequential writes (hotspots).</li>
               </ul>
             ) : (
               <ul className="space-y-1">
                 <li className="text-purple-400 font-mono">ID % 3 == 0 → Shard A</li>
                 <li className="text-purple-400 font-mono">ID % 3 == 1 → Shard B</li>
                 <li className="text-purple-400 font-mono">ID % 3 == 2 → Shard C</li>
                 <li className="mt-2 text-xs italic text-slate-500">Even distribution, but range queries must hit all shards.</li>
               </ul>
             )}
          </div>

          <div className="space-y-4">
            <form onSubmit={handleInsert} className="flex gap-2">
              <input 
                type="number" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter User ID"
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-bold">
                Insert
              </button>
            </form>

            <div className="border-t border-slate-700 pt-4">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Quick Scenarios</p>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleScenario('sequential')} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white">
                        Insert 90, 91, 92...
                    </button>
                     <button onClick={() => handleScenario('distributed')} className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white">
                        Insert Random
                    </button>
                </div>
            </div>
             <button onClick={reset} className="w-full mt-2 flex items-center justify-center gap-2 text-slate-500 hover:text-white text-sm">
                <RefreshCw size={14} /> Reset
             </button>
          </div>
        </div>

        {/* Visual Simulation Area */}
        <div className="lg:col-span-2 bg-slate-900/50 rounded-xl border border-slate-700 p-8 relative overflow-hidden min-h-[400px] flex flex-col justify-end">
            
            {/* Incoming Data Animation Zone (Simplified) */}
            <div className="absolute top-0 left-0 right-0 h-32 flex items-center justify-center pointer-events-none">
                 {items.length === 0 && <span className="text-slate-600 text-sm">Waiting for data...</span>}
            </div>

            {/* Buckets */}
            <div className="grid grid-cols-3 gap-4 items-end h-full">
                {[0, 1, 2].map((idx) => (
                    <div key={idx} className="flex flex-col items-center gap-4">
                        {/* Falling Items Stack */}
                        <div className="flex flex-col-reverse gap-1 h-32 overflow-hidden w-full items-center">
                            {items.filter(i => i.shardIndex === idx).slice(-5).map((item, i) => (
                                <DataPacket key={`${item.id}-${i}`} value={item.id} color={strategy === 'range' ? 'bg-blue-500' : 'bg-purple-500'} />
                            ))}
                        </div>
                        
                        <ArrowDown className={`animate-bounce ${shardLoads[idx] > 80 ? 'text-red-500' : 'text-slate-600'}`} />
                        
                        <DatabaseCylinder 
                            load={shardLoads[idx]} 
                            status={shardLoads[idx] > 90 ? 'critical' : shardLoads[idx] > 0 ? 'healthy' : 'healthy'}
                            label={`Shard ${['A','B','C'][idx]}`}
                            subLabel={strategy === 'range' ? (idx === 0 ? '0-100' : idx === 1 ? '101-200' : '201+') : `ID % 3 == ${idx}`}
                        />
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StrategiesTab;