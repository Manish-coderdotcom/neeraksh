import React, { useState, useEffect } from 'react';
import { Radar, ShieldAlert, Satellite, Radio, Clock, Layers, LogOut, UserCheck } from 'lucide-react';

export default function Header({ onQuickViewChange, currentUser, onLogout }) {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#070f1e]/90 backdrop-blur-md border-b border-cyan-900/40 sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-[1800px] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        
        {/* Title & Tagline Branding */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-900/40 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Radar className="w-7 h-7 animate-spin-slow" />
          </div>
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="font-display font-bold text-2xl lg:text-3xl tracking-tight text-white flex items-center gap-2">
                TIDEMARK
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 tracking-wider uppercase font-medium">
                  MISSION CONTROL v2.4
                </span>
              </h1>
            </div>
            
            <h2 className="text-xs lg:text-sm text-cyan-200/90 font-medium mt-0.5 max-w-4xl leading-snug">
              Leveraging Satellite Imagery to Determine Oil Spills at Sea along with AIS Data Correlation to Identify the Vessel Responsible
            </h2>
            
            <p className="text-xs text-slate-400 italic font-mono mt-0.5">
              “From space to sea — detecting the spill, tracking the vessel, protecting our oceans.”
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Operational Badges */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start xl:self-center pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-800/80">
          
          {/* Live Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0a1628] border border-slate-700/60 font-mono text-xs text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{utcTime || '07:42:00 UTC'}</span>
          </div>

          {/* SAR Pass Ingested Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Satellite className="w-3.5 h-3.5 text-emerald-400" />
            <span>SAR pass ingested · 07:42 UTC</span>
          </div>

          {/* Active Incident Warning Badge */}
          <div 
            onClick={() => onQuickViewChange && onQuickViewChange('dashboard')}
            className="cursor-pointer flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-red-950/60 border border-red-700/60 text-red-300 text-xs font-medium font-mono hover:bg-red-900/60 transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)]"
          >
            <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
            <span>1 active incident</span>
          </div>

          {/* Authenticated Operator / Logout Controls */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-800/80">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[11px] font-mono text-cyan-300 font-semibold flex items-center gap-1.5 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{currentUser?.callsign || 'SIH Commander'}</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400 tracking-tight">
                {currentUser?.clearance || 'Level-4 Clearance'}
              </span>
            </div>
            
            <button
              onClick={onLogout}
              title="Lock Workstation & Return to Login Screen"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900/90 hover:bg-red-950/40 border border-slate-700/80 hover:border-red-500/60 text-slate-300 hover:text-red-300 transition-all text-xs font-mono cursor-pointer shadow-sm group"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400 transition-colors" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
