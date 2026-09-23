import React, { useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Sliders, 
  Compass, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { RISK_ZONES, INCIDENT_PROFILE } from '../../data/simulationData';
import OceanGlobe3D from '../globe/OceanGlobe3D';

export default function RiskZonesView() {
  const [coastalWeight, setCoastalWeight] = useState(1.0);
  const [ecoWeight, setEcoWeight] = useState(1.0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [activeTier, setActiveTier] = useState("RED");

  const selectedZone = RISK_ZONES.find(z => z.tier === activeTier) || RISK_ZONES[0];

  const handleResetWeights = () => {
    setCoastalWeight(1.0);
    setEcoWeight(1.0);
    setCurrentMultiplier(1.0);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">
              Automated Spatial Risk Classification
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Automatic Risk Zone Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Dynamic spatial risk envelopes combining hydrocarbon concentration, 72h drift vectors, ecosystem vulnerability, and coastal proximity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetWeights}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Weights</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Risk Envelope Globe + Threshold Controls & Tier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3D Globe with Dynamic Risk Envelopes (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#070f1e] overflow-hidden shadow-md">
            <div className="p-3 bg-[#0a1426] border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-400" />
                3D Concentric Spatial Risk Fields
              </span>
              <span className="text-[11px] font-mono text-rose-400">
                Active Focus: {selectedZone.name}
              </span>
            </div>

            <OceanGlobe3D
              currentHorizon="24H"
              layerVisibility={{
                spill: true,
                trajectory: true,
                riskZones: true,
                vessels: false,
                ecosystem: true,
                emergency: true,
                shippingLanes: false,
                graticule: true,
              }}
            />
          </div>

          {/* 4 Risk Tier Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {RISK_ZONES.map((zone) => {
              const isSelected = activeTier === zone.tier;

              return (
                <button
                  key={zone.tier}
                  type="button"
                  onClick={() => setActiveTier(zone.tier)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-sky-400 shadow-md ring-1 ring-sky-400/40"
                      : "bg-[#0f172a] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: zone.color }}
                    />
                    <span className="text-xs font-bold text-white">{zone.tier} ZONE</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 block">{zone.radiusNM} NM Radius</span>
                  <span className="text-[10px] text-slate-400 truncate block mt-0.5">{zone.priority}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic Weight Adjuster Sliders & Tier Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Selected Risk Tier Detailed Inspector */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider block" style={{ color: selectedZone.color }}>
                  {selectedZone.tier} RISK SPECIFICATION
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedZone.name}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold" style={{ backgroundColor: `${selectedZone.color}25`, color: selectedZone.color }}>
                {selectedZone.priority}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px] font-semibold">Zone Spatial Perimeter:</span>
                <p className="text-slate-200 leading-relaxed font-sans">{selectedZone.description}</p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px] font-semibold">Action Directive:</span>
                <p className="text-slate-200 leading-relaxed font-sans">{selectedZone.actionDirective}</p>
              </div>
            </div>
          </div>

          {/* Interactive Risk Sensitivity Sliders */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                Risk Calculation Threshold Weights
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Dynamic Mode</span>
            </div>

            <div className="space-y-3.5 text-xs">
              
              {/* Coastal Proximity Weight */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300">Coastal Proximity Weight:</span>
                  <span className="font-mono text-sky-400 font-bold">{coastalWeight.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={coastalWeight}
                  onChange={(e) => setCoastalWeight(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* Ecosystem Sensitivity Weight */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300">Ecosystem Sensitivity Bias:</span>
                  <span className="font-mono text-purple-400 font-bold">{ecoWeight.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={ecoWeight}
                  onChange={(e) => setEcoWeight(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Current Vector Multiplier */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300">Ocean Current Vector Multiplier:</span>
                  <span className="font-mono text-cyan-400 font-bold">{currentMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={currentMultiplier}
                  onChange={(e) => setCurrentMultiplier(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
