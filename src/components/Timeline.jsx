import React from 'react';
import { Play, Pause, RotateCcw, Clock, Sparkles, AlertTriangle, TrendingUp, Compass, ShieldAlert } from 'lucide-react';
import { useMaritime } from '../context/MaritimeContext';
import { TIMELINE_EVENTS } from '../data/mockData';

export default function Timeline({ 
  timelineProgress: propProgress = null, 
  onProgressChange: propOnProgressChange = null, 
  isPlaying: propIsPlaying = null, 
  onTogglePlay: propOnTogglePlay = null 
}) {
  const context = useMaritime();

  const timelineProgress = propProgress !== null ? propProgress : (context?.timelineProgress ?? 0);
  const onProgressChange = propOnProgressChange || context?.setTimelineProgress;
  const isPlaying = propIsPlaying !== null ? propIsPlaying : (context?.isPlaying ?? false);
  const onTogglePlay = propOnTogglePlay || context?.togglePlay;

  const activeHorizon = context?.activeHorizon || '0H';
  const setHorizon = context?.setHorizon;
  const currentPrediction = context?.currentPrediction;
  const currentIncident = context?.currentIncident;

  const HORIZONS = [
    { key: '0H', label: 'NOW', hours: 0, sub: '07:42 UTC' },
    { key: '6H', label: '+6H', hours: 6, sub: '13:42 UTC' },
    { key: '12H', label: '+12H', hours: 12, sub: '19:42 UTC' },
    { key: '24H', label: '+24H', hours: 24, sub: 'T+24h' },
    { key: '48H', label: '+48H', hours: 48, sub: 'T+48h' },
    { key: '72H', label: '+72H', hours: 72, sub: 'T+72h' },
  ];

  const handleSelectHorizon = (key) => {
    if (setHorizon) {
      setHorizon(key);
    }
  };

  const handleReset = () => {
    if (setHorizon) {
      setHorizon('0H');
    } else if (onProgressChange) {
      onProgressChange(0);
    }
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
      
      {/* Top Header Row: Title, Horizon Quick Select Buttons, and Key Telemetry Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800 text-sky-400 border border-slate-700/60">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Hydrodynamic Forecast Scrubber</span>
              <span className="text-[11px] font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-800/40">
                0 – 72 Hours
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select horizon or drag scrubber to simulate slick expansion, shoreline proximity threat & vessel movement.
            </p>
          </div>
        </div>

        {/* Quick Horizon Buttons: NOW, +6H, +12H, +24H, +48H, +72H */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {HORIZONS.map((h) => {
            const isActive = activeHorizon === h.key;
            return (
              <button
                key={h.key}
                type="button"
                onClick={() => handleSelectHorizon(h.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col items-center min-w-[54px] ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{h.label}</span>
                <span className={`text-[9px] font-mono font-normal ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                  {h.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Area */}
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs font-mono">
            <span className="text-slate-400">Est. Area: </span>
            <span className="text-rose-300 font-semibold">{currentPrediction?.slickAreaKm2 || 14.8} km²</span>
          </div>

          {/* Shoreline Distance */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs font-mono">
            <span className="text-slate-400">Shore Threat: </span>
            <span className="text-amber-300 font-semibold">{currentPrediction?.coastalDistanceNM || 38.4} NM</span>
          </div>

          {/* Landfall Probability */}
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono hidden sm:block">
            <span className="text-slate-400">Landfall: </span>
            <span className={currentPrediction?.landfallProbability > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-semibold'}>
              {currentPrediction?.landfallProbability || 0}%
            </span>
          </div>
        </div>

      </div>

      {/* Main Continuous Scrubber Control Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900/90 p-3 sm:p-4 rounded-xl border border-slate-800">
        
        <div className="flex items-center gap-2 shrink-0">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
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
            onClick={handleReset}
            title="Reset timeline to detection moment (07:42 UTC)"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Range Slider Container with Horizon Scale */}
        <div className="relative flex-1 py-1 px-1">
          
          {/* Key Event Markers above slider */}
          <div className="relative w-full h-4 text-[10px] text-slate-400 mb-1.5">
            <div className="absolute left-[0%] flex flex-col items-start">
              <span className="text-sky-400 font-bold">NOW (07:42)</span>
            </div>
            <div className="absolute left-[33.3%] -translate-x-1/2 flex flex-col items-center">
              <span className="text-amber-400 font-semibold">+24H (Shelf Shoals)</span>
            </div>
            <div className="absolute left-[66.6%] -translate-x-1/2 flex flex-col items-center">
              <span className="text-orange-400 font-semibold">+48H (Coastal Alert)</span>
            </div>
            <div className="absolute right-[0%] flex flex-col items-end">
              <span className="text-rose-400 font-bold">+72H (Landfall Ingress)</span>
            </div>
          </div>

          {/* Interactive Input Range Slider */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={timelineProgress}
            onChange={(e) => onProgressChange && onProgressChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />

          {/* Scale labels below slider */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1.5">
            <span>0H (14.8 km²)</span>
            <span>+6H (19.4 km²)</span>
            <span>+12H (24.2 km²)</span>
            <span>+24H (26.4 km²)</span>
            <span>+48H (47.5 km²)</span>
            <span>+72H (68.2 km²)</span>
          </div>

        </div>

      </div>

      {/* Timeline Event Feed Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
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
