import React from 'react';
import { Database, Server, Cpu, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { ShardStatus } from '../types';

interface DatabaseCylinderProps {
  load: number;
  status: ShardStatus;
  label?: string;
  subLabel?: string;
  isExploded?: boolean;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
}

export const DatabaseCylinder: React.FC<DatabaseCylinderProps> = ({ 
  load, 
  status, 
  label, 
  subLabel,
  isExploded = false,
  size = 'md',
  highlight = false
}) => {
  const getColor = () => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'offline': return 'bg-slate-600';
      default: return 'bg-blue-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-16 h-20 text-xs';
      case 'lg': return 'w-32 h-40 text-lg';
      default: return 'w-24 h-28 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 24;
      case 'lg': return 48;
      default: return 32;
    }
  };

  if (isExploded) {
    return (
      <div className={`flex flex-col items-center justify-center ${getSizeClasses()} relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
             <AlertTriangle size={getIconSize() * 1.5} className="text-red-500 animate-pulse" />
        </div>
        <div className="text-red-500 font-bold mt-20">SYSTEM FAILURE</div>
        {label && <div className="text-slate-400 mt-2">{label}</div>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center transition-all duration-300 ${highlight ? 'scale-110' : ''}`}>
      {/* Cylinder Body */}
      <div className={`relative ${getSizeClasses()} bg-slate-700 rounded-xl border-2 ${highlight ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'border-slate-600'} overflow-hidden flex flex-col justify-end shadow-lg transition-colors duration-300`}>
        {/* Load Bar */}
        <div 
          className={`w-full transition-all duration-500 ease-out ${getColor()}`} 
          style={{ height: `${Math.min(load, 100)}%` }}
        />
        
        {/* Shine/Reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        
        {/* Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Database size={getIconSize()} className="text-white/50 drop-shadow-md" />
        </div>

        {/* Percentage Text */}
        <div className="absolute top-2 right-2 text-white font-mono font-bold drop-shadow-md z-10">
          {Math.round(load)}%
        </div>
      </div>

      {/* Labels */}
      {label && <div className="mt-2 font-bold text-slate-200">{label}</div>}
      {subLabel && <div className="text-xs text-slate-400">{subLabel}</div>}
    </div>
  );
};

export const ServerRack: React.FC<{ active?: boolean }> = ({ active }) => (
  <div className={`p-4 rounded-lg border ${active ? 'border-green-500 bg-green-500/10' : 'border-slate-600 bg-slate-800'} flex items-center gap-3`}>
    <Server className={active ? 'text-green-400' : 'text-slate-400'} />
    <div className="flex flex-col">
      <span className="text-sm font-bold text-slate-200">App Server</span>
      <span className="text-xs text-slate-500">Routing Logic</span>
    </div>
  </div>
);

export const DataPacket: React.FC<{ value: string | number; color?: string }> = ({ value, color = 'bg-blue-500' }) => (
  <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${color} animate-bounce shadow-md border border-white/20`}>
    ID: {value}
  </div>
);