import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
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
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800 text-sky-400 border border-slate-700/60">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Timeline Simulation — Sentinel-1 Pass Window
              <span className="text-[11px] font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-800/40">
                05:00 - 11:00 UTC
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag scrubber to examine transponder dark window, radar detection, and slick expansion.
            </p>
          </div>
        </div>

        {/* Dynamic Telemetry Badges */}
        <div className="flex items-center gap-2.5">
          {/* Current Timestamp */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Time: </span>
            <span className="text-sky-300 font-semibold">{currentTimestamp}</span>
          </div>

          {/* Dynamic Spill Size */}
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs font-mono">
            <span className="text-slate-400">Est. Area: </span>
            <span className="text-rose-300 font-semibold">{currentSlickArea} km²</span>
          </div>
        </div>
      </div>

      {/* Main Scrubber Control Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900/90 p-3 sm:p-4 rounded-xl border border-slate-800">
        
        <div className="flex items-center gap-2 shrink-0">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            className={`py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
              isPlaying
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                : "bg-sky-600 hover:bg-sky-500 text-white shadow-sm"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Simulation</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={() => onProgressChange(45)}
            title="Reset to SAR Detection Moment (07:42 UTC)"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Range Slider Container with Event Markers */}
        <div className="relative flex-1 py-1 px-1">
          
          {/* Key Event Markers above slider */}
          <div className="relative w-full h-4 text-[11px] text-slate-400 mb-1.5">
            {/* 05:42 UTC Leak Onset Marker */}
            <div className="absolute left-[11.6%] -translate-x-1/2 flex flex-col items-center">
              <span className="text-amber-400 font-medium">05:42 (Onset)</span>
            </div>

            {/* 07:42 UTC SAR Pass Marker */}
            <div className="absolute left-[45%] -translate-x-1/2 flex flex-col items-center">
              <span className="text-rose-400 font-semibold bg-rose-950/80 px-1.5 py-0.2 rounded border border-rose-800/50">
                07:42 (SAR Pass)
              </span>
            </div>

            {/* 07:45 UTC Signal Resumed */}
            <div className="absolute left-[45.8%] translate-x-4 flex flex-col items-center hidden md:flex">
              <span className="text-sky-300 font-medium">07:45 (Resumed)</span>
            </div>
          </div>

          {/* Interactive Input Range Slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={timelineProgress}
            onChange={(e) => onProgressChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />

          {/* Scale labels below slider */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1.5">
            <span>05:00 UTC</span>
            <span>06:30 UTC</span>
            <span>08:00 UTC</span>
            <span>09:30 UTC</span>
            <span>11:00 UTC</span>
          </div>

        </div>

      </div>

      {/* Timeline Event Feed Cards */}
      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        {TIMELINE_EVENTS.slice(0, 4).map((evt) => (
          <div key={evt.id} className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="text-sky-400 font-medium">{evt.time}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-medium uppercase ${
                evt.type === 'critical' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40' :
                evt.type === 'warning' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40' :
                'bg-sky-950/80 text-sky-300 border border-sky-800/40'
              }`}>
                {evt.type}
              </span>
            </div>
            <h4 className="text-xs font-semibold text-slate-200">{evt.label}</h4>
            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">{evt.detail}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
