import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  AlertOctagon, 
  Anchor, 
  Clock, 
  ArrowUpRight,
  Globe,
  Radio,
  Layers,
  Sparkles,
  Compass,
  Cpu,
  Fish
} from 'lucide-react';
import MaritimeMap from '../MaritimeMap';
import OceanGlobe3D from '../globe/OceanGlobe3D';
import Timeline from '../Timeline';
import { INCIDENT_DATA, VESSELS } from '../../data/mockData';
import { INCIDENT_PROFILE, PREDICTION_TIMELINE, CANDIDATE_VESSELS } from '../../data/simulationData';

export default function DashboardView({ onNavigate, onLaunchDemo }) {
  const [selectedVesselId, setSelectedVesselId] = useState("solara");
  const [timelineProgress, setTimelineProgress] = useState(45); // 07:42 UTC
  const [isPlaying, setIsPlaying] = useState(false);
  const [mapMode, setMapMode] = useState("3D"); // "3D" or "2D"
  const [activeHorizon, setActiveHorizon] = useState("0H");

  const selectedVessel = CANDIDATE_VESSELS.find(v => v.id === selectedVesselId) || CANDIDATE_VESSELS[0];
  const likelyVessel = CANDIDATE_VESSELS[0]; // MV Solara (Top suspect score 91)

  // Calculate dynamic area for spill card
  const growthFactor = 0.8 + (timelineProgress / 100) * 0.6;
  const currentSlickArea = (INCIDENT_DATA.baseSizeKm2 * growthFactor).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
              Active Investigation · Incident #{INCIDENT_PROFILE.incidentId}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Marine Intelligence & Emergency Response Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time correlation of Sentinel-1 radar backscatter, AIS vessel telemetry, and hydrodynamic drift forecasting.
          </p>
        </div>

        {/* Quick Command Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onLaunchDemo && (
            <button
              type="button"
              onClick={onLaunchDemo}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Run Demo Simulation</span>
            </button>
          )}

          <button 
            type="button"
            onClick={() => onNavigate('prediction')}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <TrendingUp className="w-4 h-4 text-white" />
            <span>Spill Forecast (0-72h)</span>
          </button>

          <button 
            type="button"
            onClick={() => onNavigate('reports')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Legal Report</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Viewport with 3D/2D Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Compass className="w-4 h-4 text-sky-400" />
            <span>GEOSPATIAL VISUALIZATION LAYER:</span>
            <span className="text-sky-300 font-mono text-[11px]">{INCIDENT_PROFILE.locationFormatted}</span>
          </div>

          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setMapMode("3D")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                mapMode === "3D"
                  ? "bg-sky-500 text-slate-950 font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Digital Ocean</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode("2D")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                mapMode === "2D"
                  ? "bg-sky-500 text-slate-950 font-bold shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D Tactical Map</span>
            </button>
          </div>
        </div>

        {/* 3D Globe or 2D Vector Map */}
        {mapMode === "3D" ? (
          <OceanGlobe3D 
            currentHorizon={activeHorizon}
            selectedEntity={selectedVessel}
            onSelectEntity={(entity) => {
              if (entity.type === 'VESSEL') setSelectedVesselId(entity.data.id);
            }}
          />
        ) : (
          <MaritimeMap 
            timelineProgress={timelineProgress}
            selectedVesselId={selectedVesselId}
            onSelectVessel={(id) => setSelectedVesselId(id)}
          />
        )}
      </div>

      {/* Interactive Scrubber Timeline */}
      <Timeline 
        timelineProgress={timelineProgress}
        onProgressChange={setTimelineProgress}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />

      {/* Primary Suspect Attribution Card */}
      <div className="relative bg-[#131b2e] border border-rose-600/40 rounded-2xl p-5 sm:p-6 shadow-sm overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Column: Vessel Identity */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" />
                Primary Potential Source Attributed
              </span>
              <span className="text-xs text-rose-300 font-medium">
                Rank #1 Candidate
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {likelyVessel.name}
              </h3>
              <span className="text-xs text-slate-300 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                {likelyVessel.type}
              </span>
              <span className="text-xs text-slate-400">
                Flag: {likelyVessel.flag}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-0.5">MMSI / IMO:</span>
                <span className="text-white font-mono font-bold text-sm">{likelyVessel.mmsi}</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-0.5">Speed Anomaly:</span>
                <span className="text-amber-300 font-medium text-sm">{likelyVessel.currentSpeedKnots} kt (+6.2 kt jump)</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-0.5">SAR Cross-Check:</span>
                <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Confirmed Hull Match
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
              Attributed based on spatio-temporal proximity to the slick origin, a 2-hour AIS transponder gap during estimated leak onset, and a significant post-gap acceleration anomaly.
            </p>
          </div>

          {/* Right Column: Attribution Score */}
          <div className="flex flex-col items-center justify-center bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shrink-0 min-w-[200px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Correlation Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-rose-500 tracking-tight">
                {likelyVessel.correlationScore}
              </span>
              <span className="text-lg text-slate-400 font-bold">/100</span>
            </div>
            
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-rose-500 h-full w-[91%]" />
            </div>

            <button 
              type="button"
              onClick={() => onNavigate('vessel-source')}
              className="mt-4 w-full py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Inspect AIS Forensics</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 4 Feature Deep-Dive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Spill Prediction Card */}
        <div 
          onClick={() => onNavigate('prediction')}
          className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-sky-500/80 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                Spill Prediction
              </span>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded">0-72H</span>
            </div>
            <p className="text-xs text-slate-400">Hydrodynamic trajectory tracking wind and ocean currents.</p>
          </div>
          <span className="text-[11px] text-sky-300 font-medium mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Drift Forecast →
          </span>
        </div>

        {/* Future Consequences Card */}
        <div 
          onClick={() => onNavigate('consequences')}
          className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-amber-500/80 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                Consequences Sim
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded">Models</span>
            </div>
            <p className="text-xs text-slate-400">Simulate environmental exposure, cleanup index & economic loss.</p>
          </div>
          <span className="text-[11px] text-amber-300 font-medium mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Simulate Scenarios →
          </span>
        </div>

        {/* Marine Ecosystem Impact Card */}
        <div 
          onClick={() => onNavigate('ecosystem')}
          className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-rose-500/80 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Fish className="w-4 h-4 text-rose-400" />
                Ecosystem Impact
              </span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-2 py-0.5 rounded">Critical</span>
            </div>
            <p className="text-xs text-slate-400">Analyze threat to Lophelia coral reefs, fisheries & bird MPAs.</p>
          </div>
          <span className="text-[11px] text-rose-300 font-medium mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Examine Habitats →
          </span>
        </div>

        {/* Emergency Response Optimizer Card */}
        <div 
          onClick={() => onNavigate('emergency')}
          className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-emerald-500/80 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                Emergency Optimizer
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Tactical</span>
            </div>
            <p className="text-xs text-slate-400">Prioritize containment boom staging, skimmers & drone assets.</p>
          </div>
          <span className="text-[11px] text-emerald-300 font-medium mt-3 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Optimize Dispatch →
          </span>
        </div>

      </div>

    </div>
  );
}
