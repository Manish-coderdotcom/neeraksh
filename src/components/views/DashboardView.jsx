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
  Fish,
  Wind,
  Waves,
  Thermometer,
  Search,
  Crosshair,
  Sliders,
  FileText,
  Ship,
  Eye,
  Activity,
  Play
} from 'lucide-react';
import MaritimeMap from '../MaritimeMap';
import OceanGlobe3D from '../globe/OceanGlobe3D';
import Timeline from '../Timeline';
import { useMaritime } from '../../context/MaritimeContext';

// Modals
import SpillDetailModal from '../modals/SpillDetailModal';
import VesselDetailModal from '../modals/VesselDetailModal';
import SimulationRunnerModal from '../modals/SimulationRunnerModal';
import FutureConsequencesModal from '../modals/FutureConsequencesModal';
import RiskZoneModal from '../modals/RiskZoneModal';
import OilAnalysisModal from '../modals/OilAnalysisModal';
import IncidentDossierModal from '../modals/IncidentDossierModal';
import ReportExportModal from '../modals/ReportExportModal';
import EcosystemDetailModal from '../modals/EcosystemDetailModal';
import SatelliteDetailModal from '../modals/SatelliteDetailModal';

export default function DashboardView({ onNavigate, onLaunchDemo }) {
  const {
    currentIncident,
    vessels,
    selectedVesselId,
    setSelectedVesselId,
    selectedVessel,
    activeHorizon,
    setHorizon,
    timelineProgress,
    setTimelineProgress,
    isPlaying,
    togglePlay,
    environment,
    currentPrediction,
    runIncidentSimulation,
    openEntityModal,
    setActiveModal,
    focusOnCoordinates,
    searchQuery,
    setSearchQuery,
    performSearch,
    addToast
  } = useMaritime();

  const [mapMode, setMapMode] = useState("3D"); // "3D" or "2D"
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      performSearch(searchInput);
    }
  };

  const handleSelectCandidate = (vessel) => {
    setSelectedVesselId(vessel.id);
    if (vessel.coordinates) {
      focusOnCoordinates(vessel.coordinates.lat, vessel.coordinates.lng, 180);
      addToast(`Selected ${vessel.name} · Centering Map`, 'info');
    }
  };

  const likelyVessel = selectedVessel || vessels[0];

  return (
    <div className="space-y-6">
      
      {/* 1. Title Header Section & Global Operational Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
              Active Investigation · Incident #{currentIncident.id || 'INC-2026-0906'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Marine Intelligence & Emergency Response Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time correlation of Sentinel-1 radar backscatter, AIS vessel telemetry, and hydrodynamic drift forecasting.
          </p>
        </div>

        {/* Global Search Bar & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Global Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center min-w-[240px]">
            <input
              type="text"
              placeholder="Search Incident, Vessel, IMO, MMSI..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          </form>

          {/* Functional Simulation Button */}
          <button
            type="button"
            onClick={runIncidentSimulation}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-cyan-500/20 active:scale-95"
            title="Execute 9-Stage AI Investigation Pipeline"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>RUN INCIDENT SIMULATION</span>
          </button>

          {/* Spill Forecast Navigation */}
          <button 
            type="button"
            onClick={() => onNavigate('prediction')}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <TrendingUp className="w-3.5 h-3.5 text-white" />
            <span>Forecast (0-72h)</span>
          </button>

          {/* Evidence Dossier / Report */}
          <button 
            type="button"
            onClick={() => setActiveModal('REPORT_EXPORT')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Legal Report</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive MetOcean Weather & Environmental Conditions Card (Requirement 11) */}
      <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Ocean & Atmospheric MetOcean Conditions ({activeHorizon}):
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-sans">
          {/* Wind */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-950/80 text-sky-400 border border-sky-800/40">
              <Wind className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Wind Vector</span>
              <strong className="text-white font-mono">{environment.wind.description}</strong>
            </div>
          </div>

          {/* Current */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Ocean Current</span>
              <strong className="text-white font-mono">{environment.current.description}</strong>
            </div>
          </div>

          {/* Waves */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800/40">
              <Waves className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Significant Waves</span>
              <strong className="text-white font-mono">{environment.waves.description}</strong>
            </div>
          </div>

          {/* Temperature */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <Thermometer className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Sea Temp</span>
              <strong className="text-white font-mono">{environment.temperature.description}</strong>
            </div>
          </div>
        </div>

        {/* Quick Simulator Launchers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveModal('RISK_ZONES')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700/80 flex items-center gap-1.5 cursor-pointer"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Risk Simulator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveModal('CONSEQUENCES')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700/80 flex items-center gap-1.5 cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Consequences Sim</span>
          </button>
        </div>

      </div>

      {/* 3. Main Interactive Map Viewport with 3D / 2D Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Compass className="w-4 h-4 text-sky-400" />
            <span>GEOSPATIAL VISUALIZATION LAYER:</span>
            <span className="text-sky-300 font-mono text-[11px]">{currentIncident.locationFormatted || '61.4200° N, 04.1800° E'}</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-mono text-[11px]">HORIZON: {activeHorizon}</span>
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
            selectedEntity={likelyVessel}
            onSelectEntity={(type, data) => openEntityModal(type, data)}
          />
        ) : (
          <MaritimeMap 
            timelineProgress={timelineProgress}
            selectedVesselId={selectedVesselId}
            onSelectVessel={(id) => setSelectedVesselId(id)}
          />
        )}
      </div>

      {/* 4. Interactive Timeline Scrubber & Horizon Controller (NOW, 6h, 12h, 24h, 48h, 72h) */}
      <Timeline />

      {/* 5. Source Attribution & Suspect Card Section (Requirements 9 & 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Primary Suspect Attribution Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#131b2e] border border-rose-600/40 rounded-2xl p-5 sm:p-6 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Primary Potential Source Attributed
                </span>
                <span className="text-xs text-rose-300 font-medium font-mono">
                  Rank #{likelyVessel.attributionRank} Candidate
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase tracking-wider block text-[10px]">
                  Match Score
                </span>
                <span className="text-2xl font-black text-rose-400 font-mono">
                  {likelyVessel.matchProbability}%
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-baseline gap-3 pt-1">
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
                <span className="text-slate-400 block text-[11px] mb-0.5">IMO / MMSI:</span>
                <span className="text-white font-mono font-bold">{likelyVessel.imo} / {likelyVessel.mmsi}</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-0.5">Speed Anomaly:</span>
                <span className="text-amber-300 font-medium">{likelyVessel.currentSpeed} (+6.2 kt jump)</span>
              </div>
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-0.5">SAR Cross-Check:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Confirmed Hull Match
                </span>
              </div>
            </div>

            {/* AI Analysis / Explanation Text (Requirement 10) */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-sky-900/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Automated Attribution Analysis</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                "Satellite imagery detected a high-confidence dark slick. AIS trajectory analysis identified <strong>{likelyVessel.name}</strong> as the strongest potential source based on proximity, heading correlation, and track intersection."
              </p>
              <p className="text-[11px] text-slate-400 leading-snug">
                Evidence: 2-hour AIS transponder blackout (05:42 - 07:42 UTC) directly coinciding with estimated leak onset, followed by a +6.2 kt acceleration anomaly away from Sector 4B.
              </p>
            </div>

          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => openEntityModal('VESSEL', likelyVessel)}
              className="py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Inspect AIS Forensics Dossier</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('REPORT_EXPORT')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Legal Citation</span>
            </button>
          </div>
        </div>

        {/* Right Column: Source Attribution Ranked Candidate Vessels List (5 cols, Requirement 9) */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Ship className="w-4 h-4 text-sky-400" />
              <span>Source Attribution Candidates</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Ranked by Match %</span>
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {vessels.map((v, idx) => {
              const isSelected = v.id === selectedVesselId;
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectCandidate(v)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-rose-950/30 border-rose-500/80 shadow-sm'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-rose-300' : 'text-white'}`}>
                        {idx + 1}. {v.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{v.flag}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 mt-1 font-mono">
                      <span>Dist: {v.distanceFromSpill}</span>
                      <span>·</span>
                      <span>Track: {v.trackOverlap}%</span>
                      <span>·</span>
                      <span>Heading: {v.headingCorrelation}%</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-lg font-black font-mono block ${
                      v.matchProbability >= 80 ? 'text-rose-400' : v.matchProbability >= 50 ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      {v.matchProbability}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Match</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <span className="text-[10px] text-slate-400 font-mono">
              Click candidate to focus 3D globe & highlight historical route.
            </span>
          </div>
        </div>

      </div>

      {/* 6. Four Feature Deep-Dive Cards */}
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
          onClick={() => setActiveModal('CONSEQUENCES')}
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
            <p className="text-xs text-slate-400">Simulate 24h, 48h, 72h environmental exposure, cleanup index & economic loss.</p>
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

      {/* Render All Interactive Operational Modals */}
      <SpillDetailModal />
      <VesselDetailModal />
      <SimulationRunnerModal />
      <FutureConsequencesModal />
      <RiskZoneModal />
      <OilAnalysisModal />
      <IncidentDossierModal />
      <ReportExportModal />
      <EcosystemDetailModal />
      <SatelliteDetailModal />

    </div>
  );
}
