import React from 'react';
import { 
  X, 
  ShieldAlert, 
  MapPin, 
  Satellite, 
  Droplet, 
  Compass, 
  Calendar, 
  Ship, 
  Activity, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { useMaritime } from '../../context/MaritimeContext';

export default function IncidentDossierModal() {
  const { activeModal, closeModal, currentIncident, currentPrediction, selectedVessel, setActiveModal } = useMaritime();

  if (activeModal !== 'INCIDENT_DOSSIER') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0b1325] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0f1a33]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  Official Maritime Incident Dossier
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                  {currentIncident.id}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Incident Profile & Operational Command Dossier
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-0.5">Case Identifier:</span>
              <span className="text-white font-mono font-bold text-sm">{currentIncident.id}</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-0.5">IMO Code:</span>
              <span className="text-slate-300 font-mono text-xs">{currentIncident.officialCode}</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-0.5">Detection Sensor:</span>
              <span className="text-emerald-400 font-semibold">{currentIncident.sarSatellite}</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-0.5">Estimated Onset:</span>
              <span className="text-amber-300 font-mono">{currentIncident.estimatedOnset}</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-0.5">SAR Pass Timestamp:</span>
              <span className="text-sky-300 font-mono">{currentIncident.detectionTime}</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] mb-0.5">Detection Confidence:</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">{currentIncident.confidence}</span>
            </div>
          </div>

          {/* Geographical & Bathymetric Extent */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Geographic & Bathymetric Sector</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div><strong>Region: </strong>{currentIncident.region}</div>
              <div><strong>Coordinates: </strong>{currentIncident.locationFormatted}</div>
              <div><strong>Sea State: </strong>{currentIncident.seaState}</div>
              <div><strong>Depth & Temp: </strong>285m bathymetric shelf, 11.4°C SST</div>
            </div>
          </div>

          {/* Primary Source Vessel Correlation Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-800/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <Ship className="w-4 h-4 text-rose-400" />
                <span>Primary Attributed Source Vessel</span>
              </h4>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold">
                {selectedVessel.matchProbability}% Match Score
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Attributed to <strong>{selectedVessel.name}</strong> ({selectedVessel.type}, IMO: {selectedVessel.imo}, MMSI: {selectedVessel.mmsi}) based on a 2-hour AIS transponder gap during estimated leak onset and sudden +6.2 kt acceleration out of Sector 4B.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0a1122] border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              closeModal();
              setActiveModal('REPORT_EXPORT');
            }}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Generate Full Legal Report</span>
          </button>

          <button
            type="button"
            onClick={closeModal}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
