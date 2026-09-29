import React, { useState } from 'react';
import { 
  X, 
  AlertOctagon, 
  Wind, 
  Waves, 
  Compass, 
  ShieldAlert, 
  Sliders, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useMaritime } from '../../context/MaritimeContext';

export default function RiskZoneModal() {
  const { activeModal, closeModal, environment, currentPrediction, toggleLayer, layers, addToast } = useMaritime();

  // Adjustable weight factors for Risk Zone Simulator
  const [weights, setWeights] = useState({
    spillSize: 85,
    windShear: 70,
    currentVector: 65,
    coastalProximity: 90,
    coralVulnerability: 95,
    vesselTraffic: 50,
  });

  if (activeModal !== 'RISK_ZONES') return null;

  // Composite calculation
  const compositeRiskScore = Math.round(
    (weights.spillSize * 0.25) +
    (weights.windShear * 0.15) +
    (weights.currentVector * 0.15) +
    (weights.coastalProximity * 0.20) +
    (weights.coralVulnerability * 0.15) +
    (weights.vesselTraffic * 0.10)
  );

  const getTier = (score) => {
    if (score >= 75) return { tier: 'HIGH', color: 'text-rose-400', badge: 'bg-rose-950 text-rose-300 border-rose-800' };
    if (score >= 50) return { tier: 'MEDIUM', color: 'text-orange-400', badge: 'bg-orange-950 text-orange-300 border-orange-800' };
    return { tier: 'LOW', color: 'text-yellow-400', badge: 'bg-yellow-950 text-yellow-300 border-yellow-800' };
  };

  const status = getTier(compositeRiskScore);

  const handleApply = () => {
    if (!layers.riskZones) {
      toggleLayer('riskZones');
    }
    addToast(`Dynamic Risk Envelopes calibrated (Score: ${compositeRiskScore}/100)`, 'info');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0b1325] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0f1a33]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  Dynamic Spatial Envelopes
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${status.badge}`}>
                  {status.tier} RISK TIER
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Dynamic Risk Zone Simulator
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
          
          {/* Composite Score Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Composite Multi-Factor Threat Index
              </span>
              <span className="text-xs text-slate-300 mt-1 block">
                Calculated across 8 oceanographic, bathymetric, and ecological vectors.
              </span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-rose-400 font-mono">{compositeRiskScore}</span>
              <span className="text-xs text-slate-400 font-mono"> / 100</span>
            </div>
          </div>

          {/* 3 Concentric Ring Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/60">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold text-rose-300">HIGH RISK ZONE</span>
              </div>
              <span className="text-xs font-mono text-slate-300 block">Radius: 0 – 8.0 NM</span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Acute lethal concentration; complete sea surface coverage.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-950/30 border border-orange-800/60">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-xs font-bold text-orange-300">MEDIUM RISK ZONE</span>
              </div>
              <span className="text-xs font-mono text-slate-300 block">Radius: 8 – 16.0 NM</span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Sub-surface dissolved hydrocarbons; embryonic fish toxicity.
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-yellow-950/30 border border-yellow-800/60">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-xs font-bold text-yellow-300">LOW RISK ZONE</span>
              </div>
              <span className="text-xs font-mono text-slate-300 block">Radius: 16 – 28.0 NM</span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Sheen periphery & atmospheric volatile organic dispersion.
              </span>
            </div>

          </div>

          {/* Interactive Factor Weights Sliders */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>Adjust Threat Factor Sensitivity Weights</span>
              </h4>
              <button
                type="button"
                onClick={() => setWeights({
                  spillSize: 85,
                  windShear: 70,
                  currentVector: 65,
                  coastalProximity: 90,
                  coralVulnerability: 95,
                  vesselTraffic: 50,
                })}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Weights</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Spill Surface Area ({currentPrediction?.slickAreaKm2} km²)</span>
                  <span className="font-mono text-white">{weights.spillSize}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.spillSize}
                  onChange={e => setWeights(w => ({ ...w, spillSize: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-800 rounded accent-rose-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Wind Shear & Drift ({environment.wind.speedKnots} kt)</span>
                  <span className="font-mono text-white">{weights.windShear}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.windShear}
                  onChange={e => setWeights(w => ({ ...w, windShear: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-800 rounded accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Coastal Proximity Threat ({currentPrediction?.coastalDistanceNM} NM)</span>
                  <span className="font-mono text-white">{weights.coastalProximity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.coastalProximity}
                  onChange={e => setWeights(w => ({ ...w, coastalProximity: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-800 rounded accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Coral Reefs & Protected MPAs</span>
                  <span className="font-mono text-white">{weights.coralVulnerability}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights.coralVulnerability}
                  onChange={e => setWeights(w => ({ ...w, coralVulnerability: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-800 rounded accent-rose-500 cursor-pointer"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0a1122] border-t border-slate-800 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.riskZones}
              onChange={() => toggleLayer('riskZones')}
              className="rounded accent-rose-500 w-4 h-4"
            />
            <span>Render Risk Envelopes on 3D Globe</span>
          </label>

          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Apply & View on Globe
          </button>
        </div>

      </div>
    </div>
  );
}
