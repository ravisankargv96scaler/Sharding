import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertTriangle, RefreshCcw } from 'lucide-react';
import { DatabaseCylinder } from '../components/DatabaseVisuals';

const RebalancingTab: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Imbalanced, 1: Adding Shard, 2: Migrating, 3: Done
  const [shardALoad, setShardALoad] = useState(100);
  const [shardBLoad, setShardBLoad] = useState(0);
  const [shardCLoad, setShardCLoad] = useState(0);

  const startRebalance = () => {
    setStep(1);
    
    // Step 1: Add C
    setTimeout(() => {
        setStep(2);
        // Step 2: Migrate
        migrateData();
    }, 1000);
  };

  const migrateData = () => {
      let currentA = 100;
      let currentB = 0;
      let currentC = 0;

      const interval = setInterval(() => {
          if (currentA > 34) {
              currentA -= 2;
              currentB += 1;
              currentC += 1;
              setShardALoad(currentA);
              setShardBLoad(currentB);
              setShardCLoad(currentC);
          } else {
              clearInterval(interval);
              setStep(3);
          }
      }, 50);
  };

  const reset = () => {
      setStep(0);
      setShardALoad(100);
      setShardBLoad(0);
      setShardCLoad(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">The Rebalancing Nightmare</h2>
        <p className="text-slate-400">
            Sharding isn't free. If Shard A gets full, you add Shard C. But Shard C is empty! 
            You must move data from A to C while the app is still running. This is risky and slows down the system.
        </p>
      </div>

      <div className={`p-8 rounded-2xl border transition-colors duration-500
          ${step === 2 ? 'bg-yellow-900/20 border-yellow-600' : 'bg-slate-900 border-slate-700'}`}>
          
          <div className="flex justify-between items-center mb-8">
              <div className="flex gap-4">
                  <button 
                    onClick={startRebalance} 
                    disabled={step !== 0}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg"
                  >
                      {step === 0 ? "Add Shard C & Rebalance" : "Processing..."}
                  </button>
                  <button onClick={reset} className="px-4 py-2 text-slate-400 hover:text-white underline">
                      Reset
                  </button>
              </div>

              {step === 2 && (
                  <div className="flex items-center gap-2 text-yellow-500 font-bold animate-pulse bg-yellow-900/50 px-4 py-2 rounded-full border border-yellow-700">
                      <AlertTriangle size={20} />
                      PERFORMANCE DEGRADED: MIGRATING DATA
                  </div>
              )}
               {step === 3 && (
                  <div className="flex items-center gap-2 text-green-500 font-bold bg-green-900/50 px-4 py-2 rounded-full border border-green-700">
                      <RefreshCcw size={20} />
                      REBALANCE COMPLETE
                  </div>
              )}
          </div>

          <div className="flex items-end justify-center gap-8 md:gap-16 min-h-[250px] relative">
              
              {/* Arrows during migration */}
              {step === 2 && (
                  <div className="absolute inset-0 flex items-center justify-center -translate-y-8 z-10 pointer-events-none">
                       <div className="flex w-full justify-center gap-20">
                            <ArrowRight className="text-yellow-500 animate-pulse w-12 h-12" />
                            <ArrowRight className="text-yellow-500 animate-pulse w-12 h-12" />
                       </div>
                  </div>
              )}

              <DatabaseCylinder 
                load={shardALoad} 
                status={step === 2 ? 'warning' : 'healthy'} 
                label="Shard A"
                highlight={step === 2}
              />
              
              <DatabaseCylinder 
                load={shardBLoad} 
                status={step === 2 ? 'warning' : 'healthy'} 
                label="Shard B"
                highlight={step === 2}
              />

              <div className={`transition-all duration-500 transform ${step === 0 ? 'opacity-0 translate-y-10 scale-0' : 'opacity-100 translate-y-0 scale-100'}`}>
                   <DatabaseCylinder 
                    load={shardCLoad} 
                    status={step === 2 ? 'warning' : 'healthy'} 
                    label="Shard C"
                    highlight={step === 2}
                />
              </div>

          </div>
      </div>
    </div>
  );
};

export default RebalancingTab;