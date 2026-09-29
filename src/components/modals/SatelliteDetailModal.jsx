import React from 'react';
import { 
  X, 
  Radio, 
  Satellite, 
  Clock, 
  CheckCircle2, 
  Maximize2, 
  Layers, 
  ShieldCheck, 
  Activity, 
  FileText,
  Navigation
} from 'lucide-react';
import { useMaritime } from '../../context/MaritimeContext';

export default function SatelliteDetailModal() {
  const { activeModal, closeModal, currentIncident, setActiveModal, focusOnCoordinates, addToast } = useMaritime();

  if (activeModal !== 'SATELLITE_INFO') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#091122] border border-sky-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d172e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Satellite className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Sentinel-1A C-SAR Observation Swath</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                  ORBITAL PASS ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Copernicus Constellation · Sun-Synchronous Polar Orbit (Alt: 693 km) · Inclination: 98.18°
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
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">Radar Band</div>
              <div className="text-base font-bold font-mono text-sky-400 mt-1">C-Band (5.405 GHz)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Wavelength: 5.55 cm</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">Swath Mode</div>
              <div className="text-base font-bold font-mono text-cyan-400 mt-1">IW (Interferometric)</div>
              <div className="text-[10px] text-slate-500 mt-0.5">250 km Width · VV + VH</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">Resolution</div>
              <div className="text-base font-bold font-mono text-amber-400 mt-1">5m × 20m Spatial</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Pixel Size: 10m Ground</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[11px] text-slate-400">Acquisition UTC</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-1">07:42:11 UTC</div>
              <div className="text-[10px] text-slate-500 mt-0.5">S1A_IW_GRDH_1SDV</div>
            </div>
          </div>

          {/* Radar Damping & Capillary Wave Physics */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              Hydrocarbon Surface Wave Damping Physics
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synthetic Aperture Radar (SAR) detects maritime oil discharges because hydrocarbons dampen high-frequency Bragg wind capillary waves (1-5 cm). This creates a specular surface reflecting the radar pulse away from the antenna, resulting in a distinct dark low-backscatter anomaly:
            </p>
            <div className="p-3 rounded-lg bg-[#060c18] border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Clean Sea Backscatter (σ₀):</span>
                <span className="text-slate-200">-12.8 dB</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Oil Slick Backscatter (σ₀):</span>
                <span className="font-bold">-24.2 dB (11.4 dB Damping Anomaly)</span>
              </div>
              <div className="flex justify-between text-sky-400">
                <span>Calculated Contrast Ratio:</span>
                <span className="font-bold">13.8x Suppression Factor</span>
              </div>
            </div>
          </div>

          {/* Next Scheduled Passes */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Constellation Next Scheduled Overpasses
            </h4>
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                <span className="font-mono text-sky-300">Sentinel-1C (Descending Node)</span>
                <span className="text-slate-400">T+11h 24m (19:06 UTC) · High Res IW Mode</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                <span className="font-mono text-slate-300">Sentinel-2B Optical MSI (10m)</span>
                <span className="text-slate-400">T+27h 15m (10:57 UTC Tomorrow) · Cloud Check 45%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0d172e] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              focusOnCoordinates(61.42, 4.18, 160);
              closeModal();
              addToast('Focused on SAR Swath footprint at Sector 4B', 'info');
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            Focus Ground Footprint
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeModal();
                setActiveModal('OIL_ANALYSIS');
                addToast('Opening Oil Type & Radar Fingerprint Analysis', 'info');
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/50 text-sky-300 text-xs font-semibold transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              SAR Fingerprint Profile
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
