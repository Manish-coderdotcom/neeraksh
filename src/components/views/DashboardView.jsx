import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Maximize2, 
  Radio, 
  Activity, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertOctagon, 
  Anchor, 
  Compass, 
  Zap,
  ArrowUpRight,
  Gauge
} from 'lucide-react';
import MaritimeMap from '../MaritimeMap';
import Timeline from '../Timeline';
import { INCIDENT_DATA, VESSELS, TIMELINE_EVENTS } from '../../data/mockData';

export default function DashboardView({ onNavigate }) {
  const [selectedVesselId, setSelectedVesselId] = useState("solara");
  const [timelineProgress, setTimelineProgress] = useState(45); // Default at SAR pass moment 07:42 UTC
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedVessel = VESSELS.find(v => v.id === selectedVesselId) || VESSELS[0];
  const likelyVessel = VESSELS[0]; // MV Solara (Top suspect score 91)

  // Calculate dynamic area for spill card
  const growthFactor = 0.8 + (timelineProgress / 100) * 0.6;
  const currentSlickArea = (INCIDENT_DATA.baseSizeKm2 * growthFactor).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#071328] via-[#0a1b38] to-[#071328] p-5 rounded-xl border border-cyan-900/40 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              MISSION CONTROL // INCIDENT ANALYSIS
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-display font-bold text-white tracking-tight">
            Oil Spill Detection & Vessel Identification System
          </h2>
          <p className="text-xs lg:text-sm text-cyan-200/80 italic font-mono mt-0.5">
            “Live fusion of satellite detections and AIS tracks for the current incident.”
          </p>
        </div>

        {/* Quick Command Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('analysis')}
            className="px-3.5 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold hover:bg-cyan-500/30 transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Full Attribution Panel</span>
          </button>

          <button 
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-semibold hover:bg-red-500/30 transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Ocean Map */}
      <MaritimeMap 
        timelineProgress={timelineProgress}
        selectedVesselId={selectedVesselId}
        onSelectVessel={(id) => setSelectedVesselId(id)}
      />

      {/* Interactive Scrubber Timeline */}
      <Timeline 
        timelineProgress={timelineProgress}
        onProgressChange={setTimelineProgress}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />

      {/* HIGHLIGHTED RED-ACCENT CARD: Likely Responsible Vessel */}
      <div className="relative bg-gradient-to-r from-[#1c080b] via-[#240a0e] to-[#1a0709] border-2 border-red-600/80 rounded-xl p-5 lg:p-6 shadow-[0_0_30px_rgba(239,68,68,0.25)] overflow-hidden">
        
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Column: Vessel Identity */}
          <div className="space-y-3 max-w-2xl">
            
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded bg-red-600 text-white text-[10px] font-mono font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
                PRIMARY SUSPECT ATTRIBUTED
              </span>
              <span className="text-xs font-mono text-red-300">
                Rank #1 Target Candidate
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-white tracking-tight">
                {likelyVessel.name}
              </h3>
              <span className="text-sm font-mono text-slate-300 bg-red-950/80 px-2.5 py-0.5 rounded border border-red-800/60">
                {likelyVessel.type}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Flag: {likelyVessel.flag}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
              <div className="bg-[#120406] p-2.5 rounded border border-red-900/50">
                <span className="text-slate-400 block text-[10px]">MMSI NUMBER:</span>
                <span className="text-white font-bold text-sm">{likelyVessel.mmsi}</span>
              </div>
              <div className="bg-[#120406] p-2.5 rounded border border-red-900/50">
                <span className="text-slate-400 block text-[10px]">CURRENT SPEED:</span>
                <span className="text-amber-400 font-bold text-sm">{likelyVessel.speed} (+6.2kt anomaly)</span>
              </div>
              <div className="bg-[#120406] p-2.5 rounded border border-red-900/50 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[10px]">SAR HULL CROSS-CHECK:</span>
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  CONFIRMED MATCH
                </span>
              </div>
            </div>

            {/* Prompt Required Explanation */}
            <p className="text-xs text-red-200/90 font-mono italic bg-red-950/40 p-3 rounded-lg border border-red-800/40 leading-relaxed">
              “Ranked by proximity to the estimated spill origin, AIS transponder gaps, and post-gap speed anomalies.”
            </p>

          </div>

          {/* Right Column: High Attribution Score Dial */}
          <div className="flex flex-col items-center justify-center bg-[#140407] p-5 rounded-xl border border-red-700/60 shrink-0 min-w-[200px]">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">
              ATTRIBUTION SCORE
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-display font-black text-red-500 tracking-tight shadow-sm">
                {likelyVessel.attributionScore}
              </span>
              <span className="text-xl font-mono text-slate-400 font-bold">/100</span>
            </div>
            
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-red-500 h-full w-[91%] shadow-[0_0_10px_#ef4444]" />
            </div>

            <button 
              onClick={() => onNavigate('analysis')}
              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>INSPECT EVIDENCE</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* DETAIL CARDS GRID (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Spill Details */}
        <div className="bg-[#071326] rounded-xl border border-cyan-900/40 p-5 shadow-lg flex flex-col justify-between hover:border-cyan-700/60 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
              <h3 className="font-display font-semibold text-sm text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Spill Details
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/50">
                CONFIRMED
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-baseline pb-2 border-b border-slate-800/40">
                <span className="text-slate-400">Location:</span>
                <span className="text-cyan-300 font-bold">{INCIDENT_DATA.location}</span>
              </div>
              <div className="flex justify-between items-baseline pb-2 border-b border-slate-800/40">
                <span className="text-slate-400">Slick Area:</span>
                <span className="text-red-400 font-bold">{currentSlickArea} km²</span>
              </div>
              <div className="flex justify-between items-baseline pb-2 border-b border-slate-800/40">
                <span className="text-slate-400">Confidence:</span>
                <span className="text-emerald-400 font-bold">{INCIDENT_DATA.confidence} (High)</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Detection Time:</span>
                <span className="text-slate-200">{INCIDENT_DATA.detectionTime}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
            SAR Pass: <span className="text-cyan-300">{INCIDENT_DATA.sarSatellite}</span>
          </div>
        </div>

        {/* Card 2: Vessel Details (Selected Vessel) */}
        <div className="bg-[#071326] rounded-xl border border-cyan-900/40 p-5 shadow-lg flex flex-col justify-between hover:border-cyan-700/60 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
              <h3 className="font-display font-semibold text-sm text-white flex items-center gap-2">
                <Anchor className="w-4 h-4 text-cyan-400" />
                Vessel Details
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                selectedVessel.statusBadge === 'red' ? 'bg-red-950 text-red-300 border border-red-800' :
                selectedVessel.statusBadge === 'amber' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                selectedVessel.statusBadge === 'blue' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {selectedVessel.status}
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between items-baseline pb-2 border-b border-slate-800/40">
                <span className="text-slate-400">Name:</span>
                <span className="text-white font-bold">{selectedVessel.name}</span>
              </div>
              <div className="flex justify-between items-baseline pb-2 border-b border-slate-800/40">
                <span className="text-slate-400">MMSI:</span>
                <span className="text-cyan-300 font-semibold">{selectedVessel.mmsi}</span>
              </div>
              <div className="flex justify-between items-baseline pb-2 border-b border-slate-800/40">
                <span className="text-slate-400">Type:</span>
                <span className="text-slate-200">{selectedVessel.type}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Last Heading:</span>
                <span className="text-amber-300 font-bold">{selectedVessel.lastHeading}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Attribution Score:</span>
            <span className="text-red-400 font-bold">{selectedVessel.attributionScore}/100</span>
          </div>
        </div>

        {/* Card 3: Timeline / Track Chronological Events */}
        <div className="bg-[#071326] rounded-xl border border-cyan-900/40 p-5 shadow-lg hover:border-cyan-700/60 transition-all">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
            <h3 className="font-display font-semibold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Timeline / Track Events
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">CHRONOLOGICAL</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
              <div>
                <span className="text-slate-400 font-bold">05:42 UTC</span> — <span className="text-amber-300">Estimated leak onset</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
              <div>
                <span className="text-slate-400 font-bold">05:42 UTC</span> — <span className="text-red-400 font-semibold">AIS signal lost (Transponder dark)</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
              <div>
                <span className="text-slate-400 font-bold">07:42 UTC</span> — <span className="text-cyan-300">SAR detected slick (14.8 km²)</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
              <div>
                <span className="text-slate-400 font-bold">07:45 UTC</span> — <span className="text-amber-300">AIS signal resumed</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <div>
                <span className="text-slate-400 font-bold">07:46 UTC</span> — <span className="text-emerald-300">Speed increased (+6.2 kt anomaly)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
