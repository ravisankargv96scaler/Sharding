import React, { useState } from 'react';
import { PlusCircle, RotateCcw } from 'lucide-react';

// Helpers to position elements on a circle
const RADIUS = 120;
const CENTER = 150;

const getPos = (angleDeg: number) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180); // -90 to start at top
    return {
        x: CENTER + RADIUS * Math.cos(angleRad),
        y: CENTER + RADIUS * Math.sin(angleRad)
    };
};

const ConsistentHashingTab: React.FC = () => {
  const [hasNodeD, setHasNodeD] = useState(false);
  
  // Static keys for demo
  const keys = [
      { id: 1, angle: 10, label: 'K1' },
      { id: 2, angle: 45, label: 'K2' },
      { id: 3, angle: 90, label: 'K3' },
      { id: 4, angle: 160, label: 'K4' },
      { id: 5, angle: 220, label: 'K5' },
      { id: 6, angle: 300, label: 'K6' },
      { id: 7, angle: 350, label: 'K7' },
  ];

  // Node positions (Angles)
  // A=0, B=120, C=240. D will be at 60.
  // Ownership: Key belongs to first node clockwise.
  
  const getNodeColor = (keyAngle: number) => {
      // Logic: Find first node angle >= keyAngle. If none, wrap to first node (0/360).
      
      // Nodes sorted by angle:
      // Without D: A(0/360), B(120), C(240)
      // With D: A(0/360), D(60), B(120), C(240)
      
      if (hasNodeD) {
          if (keyAngle > 240) return '#3b82f6'; // > C -> A (Blue)
          if (keyAngle > 120) return '#ef4444'; // > B -> C (Red)
          if (keyAngle > 60) return '#22c55e';  // > D -> B (Green)
          return '#eab308';                     // > A -> D (Yellow)
      } else {
          if (keyAngle > 240) return '#3b82f6'; // > C -> A
          if (keyAngle > 120) return '#ef4444'; // > B -> C
          return '#22c55e';                     // > A -> B
      }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Consistent Hashing</h2>
        <p className="text-slate-400">
            To solve the rebalancing pain, we use a <strong>Hash Ring</strong>. 
            Nodes are placed on a circle. Keys live on the closest node clockwise.
            <br/>
            When adding a node, you only "steal" keys from your immediate neighbor. The rest stay put!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900/50 p-8 rounded-2xl border border-slate-700">
          
          {/* Controls */}
          <div className="flex flex-col justify-center space-y-6">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                 <div className="text-lg font-bold mb-4">Topology Controls</div>
                 {!hasNodeD ? (
                    <button 
                        onClick={() => setHasNodeD(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg shadow-lg"
                    >
                        <PlusCircle /> Add Node D
                    </button>
                 ) : (
                    <button 
                        onClick={() => setHasNodeD(false)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg shadow-lg"
                    >
                        <RotateCcw /> Remove Node D
                    </button>
                 )}
                 
                 <div className="mt-6 text-sm text-slate-300">
                     <p className="mb-2 font-bold">Observation:</p>
                     {hasNodeD ? (
                         <p className="text-yellow-400">
                             Node D added at 60°. <br/>
                             Only keys between 0° and 60° (K1, K2) moved from B to D. <br/>
                             <strong>Keys 90°+ (K3-K7) did not move!</strong>
                         </p>
                     ) : (
                         <p>
                             Current Nodes: A, B, C. <br/>
                             Keys map to the next node clockwise.
                         </p>
                     )}
                 </div>
             </div>
             
             {/* Legend */}
             <div className="flex flex-wrap gap-4 text-xs font-bold">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Node A</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Node B</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Node C</div>
                 {hasNodeD && <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Node D</div>}
             </div>
          </div>

          {/* Visualization */}
          <div className="flex justify-center items-center">
              <svg width="300" height="300" viewBox="0 0 300 300">
                  {/* Ring */}
                  <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#334155" strokeWidth="4" />
                  
                  {/* Nodes */}
                  {/* Node A at 0 deg */}
                  <g transform={`translate(${getPos(0).x}, ${getPos(0).y})`}>
                      <circle r="15" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                      <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">A</text>
                  </g>
                  {/* Node B at 120 deg */}
                  <g transform={`translate(${getPos(120).x}, ${getPos(120).y})`}>
                      <circle r="15" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                      <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">B</text>
                  </g>
                  {/* Node C at 240 deg */}
                  <g transform={`translate(${getPos(240).x}, ${getPos(240).y})`}>
                      <circle r="15" fill="#ef4444" stroke="#fff" strokeWidth="2" />
                      <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C</text>
                  </g>
                  
                  {/* Node D at 60 deg */}
                  <g 
                    transform={`translate(${getPos(60).x}, ${getPos(60).y})`} 
                    className={`transition-opacity duration-500 ${hasNodeD ? 'opacity-100' : 'opacity-0'}`}
                  >
                      <circle r="15" fill="#eab308" stroke="#fff" strokeWidth="2" />
                      <text x="0" y="5" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">D</text>
                  </g>

                  {/* Keys */}
                  {keys.map((k) => (
                      <g 
                        key={k.id} 
                        transform={`translate(${getPos(k.angle).x}, ${getPos(k.angle).y})`}
                        className="transition-all duration-700 ease-in-out"
                      >
                          <circle r="6" fill={getNodeColor(k.angle)} stroke="#1e293b" strokeWidth="2" />
                          <text x="10" y="4" fill="#94a3b8" fontSize="10">{k.label}</text>
                      </g>
                  ))}
              </svg>
          </div>
      </div>
    </div>
  );
};

export default ConsistentHashingTab;