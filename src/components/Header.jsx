import React, { useState, useEffect } from 'react';
import { ShieldAlert, Satellite, Clock, LogOut, Play, Radio, Sparkles } from 'lucide-react';
import { INCIDENT_PROFILE } from '../data/simulationData';

export default function Header({ onQuickViewChange, currentUser, onLogout, onLaunchDemo }) {
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
    <header className="bg-[#0b1324]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-md">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">

        {/* Top-Left Project Logo & Brand Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Team Neeraksh Official Logo"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-contain bg-[#0a1120] border border-sky-900/60 shadow-sm transition-transform hover:scale-105 duration-200"
            />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <h1 className="font-display font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                <span>NEERAKSH</span>
                <span className="text-slate-500 font-normal text-sm">/</span>
                <span className="text-sky-400 font-medium text-base sm:text-lg">Tidemark</span>
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800/50 font-medium">
                Maritime Intelligence
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/50 font-medium">
                #{INCIDENT_PROFILE.incidentId}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-normal truncate hidden sm:block">
              AI-Powered Marine Oil Spill Detection, Prediction, Source Attribution & Response Platform
            </p>
          </div>
        </div>

        {/* Center/Right Actions: Demo Mode Button, Telemetry Indicators & Operator Profile */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 self-start md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60 w-full md:w-auto justify-between md:justify-end">

          {/* Hackathon / Interview Mode Button */}
          {onLaunchDemo && (
            <button
              type="button"
              onClick={onLaunchDemo}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md hover:shadow-cyan-500/20 active:scale-95 cursor-pointer ring-1 ring-cyan-300/40"
              title="Run 9-Stage Automated Demonstration Pipeline"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>RUN INCIDENT SIMULATION</span>
            </button>
          )}

          {/* Live UTC Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{utcTime || '07:42:00 UTC'}</span>
          </div>

          {/* SAR Pass Ingested Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs font-sans">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <Satellite className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-medium">Sentinel-1 SAR · 07:42 UTC</span>
          </div>

          {/* AIS Feed Status */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>AIS: 1 Hz</span>
          </div>

          {/* Active Incident Warning Badge */}
          <button
            type="button"
            onClick={() => onQuickViewChange && onQuickViewChange('dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/50 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Active Spill (#0906)</span>
          </button>

          {/* Operator Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-xs font-medium text-slate-200 flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {currentUser?.callsign || 'SIH Commander'}
              </span>
              <span className="text-[10px] text-slate-400">
                {currentUser?.clearance || 'Level-4 Clearance'}
              </span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Sign Out / Lock Console"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 hover:text-white transition-all text-xs font-medium cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
