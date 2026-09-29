import React from 'react';
import { 
  X, 
  Ship, 
  Radio, 
  Compass, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Crosshair,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useMaritime } from '../../context/MaritimeContext';

export default function VesselDetailModal() {
  const { selectedVessel, closeModal, focusOnCoordinates, addToast, setActiveModal } = useMaritime();

  if (!selectedVessel) return null;

  const handleFocus = () => {
    if (selectedVessel.coordinates) {
      focusOnCoordinates(selectedVessel.coordinates.lat, selectedVessel.coordinates.lng, 180);
      addToast(`Focused 3D globe on ${selectedVessel.name}`, 'info');
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0b1325] border border-sky-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0f1a33]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              selectedVessel.matchProbability >= 80 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                : 'bg-sky-500/20 text-sky-400 border-sky-500/40'
            }`}>
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                  AIS Vessel Telemetry & Forensic Profile
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  selectedVessel.matchProbability >= 80
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  Rank #{selectedVessel.attributionRank}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>{selectedVessel.name}</span>
                <span className="text-xs font-normal text-slate-400">({selectedVessel.type})</span>
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
            
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">
                IMO Number
              </span>
              <span className="text-sm font-bold text-white font-mono">{selectedVessel.imo}</span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">
                MMSI Identifier
              </span>
              <span className="text-sm font-bold text-white font-mono">{selectedVessel.mmsi}</span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">
                Flag State
              </span>
              <span className="text-sm font-bold text-white">{selectedVessel.flag}</span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">
                Current Speed
              </span>
              <span className="text-sm font-bold text-amber-300 font-mono">{selectedVessel.currentSpeed}</span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">
                Heading Vector
              </span>
              <span className="text-sm font-bold text-cyan-300 font-mono">{selectedVessel.currentHeading} ({selectedVessel.headingCardinal})</span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">
                Destination
              </span>
              <span className="text-sm font-bold text-white">{selectedVessel.destination}</span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">
                Last AIS Broadcast
              </span>
              <span className="text-sm font-bold text-sky-400 font-mono">{selectedVessel.lastAisUpdate}</span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">
                Distance from Spill
              </span>
              <span className="text-sm font-bold text-rose-300 font-mono">{selectedVessel.distanceFromSpill}</span>
            </div>

            <div className={`p-3 rounded-xl border ${
              selectedVessel.matchProbability >= 80
                ? 'bg-rose-950/40 border-rose-800/80'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">
                Spill Match Probability
              </span>
              <span className={`text-base font-black font-mono ${
                selectedVessel.matchProbability >= 80 ? 'text-rose-400' : 'text-sky-300'
              }`}>
                {selectedVessel.matchProbability}%
              </span>
            </div>

          </div>

          {/* Forensic Attribution Scores Breakdown */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-sky-400" />
                <span>Forensic Correlation Factors</span>
              </span>
              <span className="text-xs font-mono text-sky-400">Composite: {selectedVessel.matchProbability}/100</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Track Overlap:</span>
                <span className="font-bold text-white font-mono">{selectedVessel.trackOverlap}%</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Heading Align:</span>
                <span className="font-bold text-white font-mono">{selectedVessel.headingCorrelation}%</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">AIS Gap Score:</span>
                <span className="font-bold text-amber-400 font-mono">{selectedVessel.aisGapScore} / 100</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Speed Anomaly:</span>
                <span className="font-bold text-rose-400 font-mono">{selectedVessel.speedAnomalyScore} / 100</span>
              </div>
            </div>

            <div className="pt-2 text-xs space-y-1.5 text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <strong className="text-amber-400">Transponder Behavior: </strong>
                <span>{selectedVessel.aisGapSummary}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <strong className="text-rose-400">Velocity Profile: </strong>
                <span>{selectedVessel.speedAnomalySummary}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <strong className="text-emerald-400">SAR Hull Radar Reflection: </strong>
                <span>{selectedVessel.sarCrossCheck}</span>
              </div>
            </div>
          </div>

          {/* Historical Movement Trail */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>AIS Spatio-Temporal Trail & Waypoints</span>
            </h4>

            <div className="space-y-1.5 pt-1">
              {selectedVessel.trail && selectedVessel.trail.map((tp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sky-400 text-[11px]">{tp.time}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-slate-300 text-[11px]">{tp.lat.toFixed(2)}°N, {tp.lng.toFixed(2)}°E</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-300 font-mono text-[11px]">{tp.speed} kt</span>
                    <span className="text-slate-400 text-[11px]">{tp.event}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0a1122] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleFocus}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Crosshair className="w-4 h-4" />
            <span>Focus 3D Globe on Vessel</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveModal('REPORT_EXPORT')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Attribution Report</span>
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
