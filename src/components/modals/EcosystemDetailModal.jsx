import React from 'react';
import { 
  X, 
  ShieldAlert, 
  Fish, 
  Trees, 
  Anchor, 
  AlertTriangle, 
  Clock, 
  Navigation, 
  Waves, 
  FileText, 
  CheckCircle2,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { useMaritime } from '../../context/MaritimeContext';
import { ECOSYSTEM_ZONES } from '../../data/simulationData';

export default function EcosystemDetailModal() {
  const { activeModal, closeModal, selectedEntity, setActiveModal, focusOnCoordinates, addToast } = useMaritime();

  if (activeModal !== 'ECOSYSTEM_INFO') return null;

  // Selected ecosystem data or default to Lophelia Coral Bioherm
  const eco = (selectedEntity?.type === 'ECOSYSTEM' && selectedEntity.data) 
    ? selectedEntity.data 
    : ECOSYSTEM_ZONES[0];

  const handleFocus = () => {
    if (eco.coordinates) {
      focusOnCoordinates(eco.coordinates.lat, eco.coordinates.lng, 180);
      closeModal();
      addToast(`Focused 3D globe on ${eco.name}`, 'info');
    }
  };

  const handleSimulateDispersants = () => {
    closeModal();
    setActiveModal('RISK_ZONES');
    addToast('Opening Dynamic Risk Zone Sensitivity Simulator', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#091122] border border-emerald-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d172e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{eco.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-950 text-rose-400 border border-rose-800">
                  {eco.vulnerabilityLevel || 'CRITICAL'} VULNERABILITY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {eco.category} · Coordinates: {eco.coordinates?.lat?.toFixed(4)}° N, {eco.coordinates?.lng?.toFixed(4)}° E
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">Distance to Spill</div>
              <div className="text-base font-bold font-mono text-amber-400 mt-1">
                {eco.distanceFromSpillNM || 18.2} NM
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Direct Hydrodynamic Path</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">Time to Impact</div>
              <div className="text-base font-bold font-mono text-rose-400 mt-1">
                {eco.timeToPotentialExposureHours || 28} Hours
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Under 18 kt NE Wind</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">Benthic Depth</div>
              <div className="text-base font-bold font-mono text-sky-400 mt-1">
                {eco.depthMeters || 220} meters
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Cold-water shelf zone</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">Protected Area</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-1">
                {eco.areaHectares || 1420} ha
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">OSPAR Annex V MPA</div>
            </div>
          </div>

          {/* Biological / Species Impact Assessment */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Ecotoxicological Vulnerability Profile
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {eco.potentialImpact || "Irreversible smothering of fragile scleractinian skeleton polyps; toxic hydrocarbon accumulation in benthic bioherm."}
            </p>
            {eco.keySpecies && (
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 font-medium">Key Indicator Species at Risk:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {eco.keySpecies.map((sp, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Operational Response Recommendation */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Mandatory Environmental Protection Directive
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {eco.recommendedResponse || "Deploy deep-water subsea deflection curtains; strictly prohibit chemical dispersant application within a 5 NM buffer zone of the reef boundary."}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0d172e] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleFocus}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            Focus on 3D Globe
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateDispersants}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-semibold transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Simulate Risk Buffers
            </button>
            <button
              onClick={() => {
                closeModal();
                setActiveModal('REPORT_EXPORT');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Generate Ecology Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
