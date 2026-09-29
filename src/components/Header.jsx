import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Satellite, 
  Clock, 
  LogOut, 
  Play, 
  Radio, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Search,
  Activity
} from 'lucide-react';
import { useMaritime } from '../context/MaritimeContext';

export default function Header({ onQuickViewChange, currentUser, onLogout, onLaunchDemo }) {
  const { 
    currentIncident, 
    runIncidentSimulation, 
    simulationState, 
    layers, 
    toggleLayer, 
    openEntityModal, 
    addToast 
  } = useMaritime();

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

  const handleToggleSar = () => {
    toggleLayer('satelliteSar');
    addToast(
      layers.satelliteSar ? 'Disabled Sentinel-1 SAR layer' : 'Enabled Sentinel-1 SAR swath overlay',
      'info'
    );
  };

  const handleToggleAis = () => {
    toggleLayer('aisVessels');
    addToast(
      layers.aisVessels ? 'Hidden AIS marine traffic layer' : 'Enabled live AIS vessel tracking layer',
      'info'
    );
  };

  const handleOpenSpill = () => {
    openEntityModal('SPILL', currentIncident);
  };

  const isSimulating = simulationState?.isRunning;

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
                #{currentIncident?.id || 'INC-2026-0906'}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-normal truncate hidden sm:block">
              AI-Powered Marine Oil Spill Detection, Prediction, Source Attribution & Response Platform
            </p>
          </div>
        </div>

        {/* Center/Right Dynamic Status Indicators & Commands (Requirement 14 & 22) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 self-start md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60 w-full md:w-auto justify-between md:justify-end text-xs">

          {/* 1. RUN INCIDENT SIMULATION Button (Actually runs 9-stage simulation) */}
          <button
            type="button"
            onClick={runIncidentSimulation}
            disabled={isSimulating}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer ring-1 ring-cyan-300/40 ${
              isSimulating
                ? 'bg-amber-500 text-slate-950 ring-amber-400'
                : 'bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 hover:shadow-cyan-500/20'
            }`}
            title="Execute 9-Stage AI Investigation Pipeline"
          >
            {isSimulating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin fill-slate-950" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-slate-950" />
            )}
            <span>{isSimulating ? `SIMULATING (${simulationState.step}/9)` : 'RUN INCIDENT SIMULATION'}</span>
          </button>

          {/* 2. Live UTC Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{utcTime || '07:42:00 UTC'}</span>
          </div>

          {/* 3. Sentinel-1 SAR Status Indicator (Clickable: Toggles SAR Layer) */}
          <button
            type="button"
            onClick={handleToggleSar}
            title="Click to toggle Sentinel-1 SAR swath overlay"
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              layers.satelliteSar
                ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${layers.satelliteSar ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <Satellite className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">Sentinel-1 SAR — LIVE</span>
          </button>

          {/* 4. AIS Stream Status Indicator (Clickable: Toggles AIS Traffic Layer) */}
          <button
            type="button"
            onClick={handleToggleAis}
            title="Click to toggle AIS marine tracking layer"
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono transition-colors cursor-pointer ${
              layers.aisVessels
                ? 'bg-slate-900/80 border-slate-800 text-slate-300'
                : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${layers.aisVessels ? 'bg-cyan-400' : 'bg-slate-600'}`} />
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>AIS — 1 Hz</span>
          </button>

          {/* 5. Active Spill Indicator (Clickable: Opens Spill Details Modal) */}
          <button
            type="button"
            onClick={handleOpenSpill}
            title="Click to open active spill telemetry dossier"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/50 text-rose-300 font-medium transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>Active Spill — #{currentIncident?.id?.replace('INC-2026-', '') || '0906'}</span>
          </button>

          {/* 6. System Operational Status */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono">
            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-slate-400">System —</span>
            <strong className={isSimulating ? 'text-amber-400' : 'text-emerald-400'}>
              {isSimulating ? 'SIMULATING' : 'OPERATIONAL'}
            </strong>
          </div>

          {/* Operator Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-xs font-medium text-slate-200 flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {currentUser?.callsign || 'Commander-SIH'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentUser?.clearance || 'Level-4'}
              </span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              title="Lock console session"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
