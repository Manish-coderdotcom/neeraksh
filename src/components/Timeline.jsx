import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, AlertTriangle, Layers, Zap } from 'lucide-react';
import { TIMELINE_EVENTS, INCIDENT_DATA } from '../data/mockData';

export default function Timeline({ 
  timelineProgress, 
  onProgressChange, 
  isPlaying, 
  onTogglePlay 
}) {

  // Map progress (0-100) to timestamp string between 05:00 UTC and 11:00 UTC
  const calculateTimestamp = (val) => {
    const startMins = 5 * 60; // 05:00 in minutes
    const totalSpanMins = 6 * 60; // 6 hours span
    const currentMins = startMins + Math.round((val / 100) * totalSpanMins);
    
    const h = String(Math.floor(currentMins / 60)).padStart(2, '0');
    const m = String(currentMins % 60).padStart(2, '0');
    return `${h}:${m} UTC`;
  };

  const currentTimestamp = calculateTimestamp(timelineProgress);

  // Dynamic slick size calculation
  const growthFactor = 0.8 + (timelineProgress / 100) * 0.6;
  const currentSlickArea = (INCIDENT_DATA.baseSizeKm2 * growthFactor).toFixed(1);

  // Auto-play interval handler
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        onProgressChange(prev => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isPlaying, onProgressChange]);

  return (
    <div className="bg-[#071326] border border-cyan-900/40 rounded-xl p-4 shadow-xl">
      
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/60">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold text-white flex items-center gap-2">
              Timeline — Scrub Through SAR Pass Window
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                05:00 UTC - 11:00 UTC
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Scrub to observe transponder gap onset, SAR radar ingest, and slick expansion.
            </p>
          </div>
        </div>

        {/* Dynamic Telemetry Badges */}
        <div className="flex items-center gap-3">
          {/* Current Timestamp */}
          <div className="px-3 py-1 rounded-md bg-[#0b1c36] border border-cyan-800/60 text-xs font-mono">
            <span className="text-slate-400">Timestamp: </span>
            <span className="text-cyan-300 font-bold">{currentTimestamp}</span>
          </div>

          {/* Dynamic Spill Size */}
          <div className="px-3 py-1 rounded-md bg-red-950/40 border border-red-800/60 text-xs font-mono">
            <span className="text-slate-400">Est. Slick Area: </span>
            <span className="text-red-400 font-bold">{currentSlickArea} km²</span>
          </div>
        </div>
      </div>

      {/* Main Scrubber Control Row */}
      <div className="flex items-center gap-4 bg-[#050c18] p-3 rounded-lg border border-slate-800/80">
        
        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlay}
          className={`p-2.5 rounded-lg font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
            isPlaying
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30"
              : "bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>PLAY SIMULATION</span>
            </>
          )}
        </button>

        {/* Reset Button */}
        <button
          onClick={() => onProgressChange(45)}
          title="Reset to SAR Detection Moment (07:42 UTC)"
          className="p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Range Slider Container with Event Markers */}
        <div className="relative flex-1 py-2">
          
          {/* Key Event Markers above slider */}
          <div className="relative w-full h-4 text-[10px] font-mono text-slate-400 mb-1">
            {/* 05:42 UTC Leak Onset Marker */}
            <div className="absolute left-[11.6%] -translate-x-1/2 flex flex-col items-center">
              <span className="text-amber-400 font-bold">05:42 (Onset)</span>
            </div>

            {/* 07:42 UTC SAR Pass Marker */}
            <div className="absolute left-[45%] -translate-x-1/2 flex flex-col items-center">
              <span className="text-red-400 font-bold bg-red-950/80 px-1 rounded border border-red-800/60">
                07:42 (SAR Ingest) 🔴
              </span>
            </div>

            {/* 07:45 UTC Signal Resumed */}
            <div className="absolute left-[45.8%] translate-x-3 flex flex-col items-center hidden sm:flex">
              <span className="text-cyan-300 font-bold">07:45 (Resumed)</span>
            </div>
          </div>

          {/* Interactive Input Range Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={timelineProgress}
            onChange={(e) => onProgressChange(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          {/* Scale labels below slider */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
            <span>05:00 UTC</span>
            <span>06:30 UTC</span>
            <span>08:00 UTC</span>
            <span>09:30 UTC</span>
            <span>11:00 UTC</span>
          </div>

        </div>

      </div>

      {/* Timeline Event Feed Cards */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {TIMELINE_EVENTS.slice(0, 4).map((evt) => (
          <div key={evt.id} className="bg-[#091830] p-2.5 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1">
              <span className="text-cyan-400 font-bold">{evt.time}</span>
              <span className={`px-1.5 py-0.2 rounded font-semibold uppercase ${
                evt.type === 'critical' ? 'bg-red-950 text-red-400 border border-red-800/50' :
                evt.type === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-800/50' :
                'bg-blue-950 text-blue-300 border border-blue-800/50'
              }`}>
                {evt.type}
              </span>
            </div>
            <h4 className="text-xs font-semibold text-slate-200">{evt.label}</h4>
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{evt.detail}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
