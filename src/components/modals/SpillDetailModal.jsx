import React from 'react';
import { 
  X, 
  ShieldAlert, 
  MapPin, 
  Droplet, 
  Wind, 
  Waves, 
  Compass, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  Download,
  Calendar,
  Layers
} from 'lucide-react';
import { useMaritime } from '../../context/MaritimeContext';

export default function SpillDetailModal() {
  const { currentIncident, currentPrediction, environment, activeHorizon, closeModal, setActiveModal } = useMaritime();

  if (!currentIncident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0b1325] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0f1a33]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <Droplet className="w-5 h-5 fill-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  Active Hydrocarbon Spill Telemetry
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                  {currentIncident.id}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {currentIncident.name}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Main Key-Value KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Incident ID
              </span>
              <span className="text-base font-bold text-white font-mono">{currentIncident.id}</span>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Spill Confidence
              </span>
              <span className="text-base font-bold text-emerald-400 font-mono">{currentIncident.confidence}</span>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Estimated Area ({activeHorizon})
              </span>
              <span className="text-base font-bold text-rose-400 font-mono">
                {currentPrediction?.slickAreaKm2 || currentIncident.baseAreaKm2} km²
              </span>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Oil Type
              </span>
              <span className="text-sm font-bold text-sky-300">{currentIncident.oilType}</span>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Estimated Volume
              </span>
              <span className="text-sm font-bold text-amber-300 font-mono">{currentIncident.estimatedVolume}</span>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Current Coordinates
              </span>
              <span className="text-xs font-bold text-cyan-300 font-mono">
                {currentPrediction?.coordinates?.lat.toFixed(4)}° N, 0{currentPrediction?.coordinates?.lng.toFixed(4)}° E
              </span>
            </div>

          </div>

          {/* Environmental Hydrodynamic Parameters */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Hydrodynamic & Atmospheric MetOcean Telemetry</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Wind Speed & Dir:</span>
                <span className="font-semibold text-white">{environment.wind.description}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Ocean Current:</span>
                <span className="font-semibold text-white">{environment.current.description}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Wave Height:</span>
                <span className="font-semibold text-white">{environment.waves.description}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] mb-0.5">Drift Velocity:</span>
                <span className="font-semibold text-cyan-300 font-mono">{currentPrediction?.driftSpeedKnots} kt @ 0{currentPrediction?.driftHeadingDeg}°</span>
              </div>
            </div>
          </div>

          {/* Risk Rings Status */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Multi-Tier Spatial Risk Envelopes</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">Shoreline Dist: <strong className="text-white">{currentPrediction?.coastalDistanceNM} NM</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <div>
                  <span className="font-semibold text-rose-300 block">High Risk (0-8 NM)</span>
                  <span className="text-[10px] text-slate-400">Acute benthic asphyxiation</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-orange-950/40 border border-orange-800/60 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                <div>
                  <span className="font-semibold text-orange-300 block">Medium Risk (8-16 NM)</span>
                  <span className="text-[10px] text-slate-400">Pelagic larval mortality</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-yellow-950/40 border border-yellow-800/60 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0" />
                <div>
                  <span className="font-semibold text-yellow-300 block">Low Risk (16-28 NM)</span>
                  <span className="text-[10px] text-slate-400">Sheen dispersion boundary</span>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Exposure Summary */}
          <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold text-rose-300 block">
                Environmental Threat Status: {currentIncident.environmentalRisk}
              </span>
              <p className="text-slate-300 leading-relaxed">
                Hydrocarbon emulsion poses immediate sedimentation risk to Lophelia pertusa cold-water reefs (220m depth) and commercial pelagic Herring spawning clutches.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0a1122] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveModal('OIL_ANALYSIS')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-sky-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>Open Oil Type Identification</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveModal('REPORT_EXPORT')}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Incident Dossier</span>
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
