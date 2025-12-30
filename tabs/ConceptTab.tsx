import React, { useState, useEffect } from 'react';
import { ArrowDown, Zap } from 'lucide-react';
import { DatabaseCylinder } from '../components/DatabaseVisuals';
import { ShardStatus } from '../types';

const ConceptTab: React.FC = () => {
  const [dataLoad, setDataLoad] = useState(20);
  const [isExploded, setIsExploded] = useState(false);
  const [isSharded, setIsSharded] = useState(false);
  const [shake, setShake] = useState(false);

  const handleInjectData = () => {
    if (isExploded) return;
    
    setShake(true);
    setTimeout(() => setShake(false), 500);

    const newLoad = dataLoad + 15;
    if (newLoad > 100 && !isSharded) {
      setDataLoad(100);
      setIsExploded(true);
    } else {
      setDataLoad(newLoad);
    }
  };

  const handleShardIt = () => {
    setIsSharded(true);
    setIsExploded(false);
    setDataLoad(33); // Distribute load
  };

  const handleReset = () => {
    setDataLoad(20);
    setIsExploded(false);
    setIsSharded(false);
  };

  const getStatus = (load: number): ShardStatus => {
    if (load > 90) return 'critical';
    if (load > 70) return 'warning';
    return 'healthy';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">The Concept: Divide & Conquer</h2>
        <p className="text-slate-400">
          When a database handles too much data or traffic, a single server hits its physical limits (CPU, RAM, Disk).
          <br />
          <strong>Sharding</strong> splits the data horizontally across multiple servers. Think of it like a library:
          One librarian can't manage 10 million books, so we split them into "History Room", "Science Room", and "Fiction Room".
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/50 p-8 rounded-2xl border border-slate-700">
        
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Zap className="text-yellow-400" /> Simulation Controls
            </h3>
            
            {!isSharded ? (
              <button
                onClick={handleInjectData}
                disabled={isExploded}
                className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all
                  ${isExploded 
                    ? 'bg-slate-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-500 active:scale-95'}`}
              >
                {isExploded ? 'SYSTEM CRITICAL' : 'Inject 1TB Data'}
              </button>
            ) : (
               <button
                onClick={handleInjectData}
                className="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-lg"
              >
                Inject More Data (Distributed)
              </button>
            )}

            {isExploded && !isSharded && (
              <div className="mt-4 animate-bounce">
                <button
                  onClick={handleShardIt}
                  className="w-full py-3 rounded-lg font-bold text-white bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/50 border-2 border-green-400"
                >
                  🛠️ SHARD IT! (Rescue Data)
                </button>
              </div>
            )}

            <button onClick={handleReset} className="mt-4 text-sm text-slate-400 underline hover:text-slate-200 w-full text-center">
              Reset Simulation
            </button>
          </div>
        </div>

        {/* Visuals */}
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          {!isSharded ? (
            <div className={`transition-transform duration-100 ${shake ? 'animate-shake' : ''}`}>
               <DatabaseCylinder 
                  load={dataLoad} 
                  status={isExploded ? 'critical' : getStatus(dataLoad)}
                  label="Monolithic DB"
                  isExploded={isExploded}
                  size="lg"
               />
               {isExploded && <div className="text-red-500 font-mono mt-4 text-center">ERROR: OUT OF DISK SPACE<br/>CPU 100%</div>}
            </div>
          ) : (
            <div className="flex gap-4 md:gap-8 items-end animate-in fade-in zoom-in duration-500">
               <DatabaseCylinder load={dataLoad / 3} status={getStatus(dataLoad / 3)} label="Shard 1" subLabel="Users A-I" />
               <DatabaseCylinder load={dataLoad / 3} status={getStatus(dataLoad / 3)} label="Shard 2" subLabel="Users J-R" />
               <DatabaseCylinder load={dataLoad / 3} status={getStatus(dataLoad / 3)} label="Shard 3" subLabel="Users S-Z" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConceptTab;