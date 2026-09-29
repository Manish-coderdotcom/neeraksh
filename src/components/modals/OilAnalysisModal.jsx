import React from 'react';
import { 
  X, 
  Droplet, 
  Satellite, 
  Activity, 
  CheckCircle2, 
  ShieldCheck, 
  Waves, 
  Compass, 
  Ship
} from 'lucide-react';
import { useMaritime } from '../../context/MaritimeContext';

export default function OilAnalysisModal() {
  const { activeModal, closeModal, currentIncident } = useMaritime();

  if (activeModal !== 'OIL_ANALYSIS') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0b1325] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0f1a33]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Droplet className="w-5 h-5 fill-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  Spectral & Radar Damping Analysis
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Confidence: 94%
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Hydrocarbon Fingerprint & Oil Classification
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
          
          {/* Key Identification Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Oil Type
              </span>
              <span className="text-base font-bold text-white">Crude Oil</span>
              <span className="text-[10px] text-sky-400 block mt-0.5">Heavy Paraffinic Crude</span>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Detection Confidence
              </span>
              <span className="text-base font-bold text-emerald-400 font-mono">94%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">ResNet-50 / U-Net Fused</span>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Estimated Viscosity
              </span>
              <span className="text-base font-bold text-amber-300 font-mono">Medium</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">185 cSt @ 15°C</span>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                SAR Signature
              </span>
              <span className="text-sm font-bold text-cyan-300 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Detected
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">-11.4 dB Capillary Damping</span>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 sm:col-span-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                Possible Source
              </span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Ship className="w-4 h-4 text-rose-400" />
                Tanker / Cargo Vessel (Laden Displacement)
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Correlated with crude tanker MV Solara (IMO 9384721)
              </span>
            </div>

          </div>

          {/* SAR Analysis Visualization */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Satellite className="w-4 h-4 text-cyan-400" />
                <span>Sentinel-1 C-SAR Radar Backscatter Waveform Profile</span>
              </h4>
              <span className="text-[11px] font-mono text-cyan-400">VV Polarization</span>
            </div>

            {/* Visual Backscatter Comparison Chart */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Clean Surrounding Ocean Backscatter (Wind 18 kt)</span>
                  <span className="font-mono text-emerald-400 font-semibold">-5.2 dB (Rough Sea Capillary Waves)</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[78%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Slick Core Radar Reflection (Viscous Wave Damping)</span>
                  <span className="font-mono text-cyan-400 font-semibold">-16.6 dB (Specular Ocean Mirroring)</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[24%]" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-mono">
                <span className="text-cyan-400 font-semibold">DELTA CONTRAST RATIO: </span>
                <span className="text-white font-bold">-11.4 dB. </span>
                <span>Matches mineral crude hydrocarbon damping coefficient. Look-alike biogenic bloom / low-wind false-positive ruled out with 97.4% statistical certitude.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a1122] border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
