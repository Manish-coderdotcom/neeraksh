import React, { useState } from 'react';
import { 
  Satellite, 
  CloudOff, 
  Eye, 
  Layers, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Wind, 
  Sparkles,
  Info
} from 'lucide-react';
import { INCIDENT_DATA } from '../../data/mockData';

export default function SatelliteImageryView() {
  const [sarThreshold, setSarThreshold] = useState(70);
  const [showMask, setShowMask] = useState(true);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#071328] via-[#0a1b38] to-[#071328] p-5 rounded-xl border border-cyan-900/40 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Satellite className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
            SATELLITE REMOTE SENSING & AI SEGMENTATION
          </span>
        </div>
        <h2 className="text-xl lg:text-2xl font-display font-bold text-white tracking-tight">
          Satellite Imagery & Classification
        </h2>
        <p className="text-xs lg:text-sm text-cyan-200/80 italic font-mono mt-0.5">
          “How a raw pass becomes a geo-referenced, confidence-scored spill polygon.”
        </p>
      </div>

      {/* SIDE-BY-SIDE SATELLITE COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Optical - Sentinel-2 (Cloud Impaired) */}
        <div className="bg-[#071120] rounded-xl border border-red-900/40 overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="p-4 bg-[#0a162b] border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-2">
                  <CloudOff className="w-4 h-4 text-amber-400" />
                  Optical — Sentinel-2
                </h3>
                <p className="text-[11px] font-mono text-slate-400">Multi-Spectral Instrument (MSI) · Band 2,3,4 (True Color)</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded">
                88.4% CLOUD COVER
              </span>
            </div>

            {/* Simulated Cloud Image Container */}
            <div className="relative h-64 sm:h-72 bg-[#121c2d] flex items-center justify-center p-6 overflow-hidden">
              
              {/* Cloud texture overlay background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-400/20 via-slate-200/40 to-slate-500/30 blur-md pointer-events-none" />
              <div className="absolute top-4 left-6 right-6 bottom-4 bg-white/20 blur-xl pointer-events-none" />

              {/* Warning overlay box */}
              <div className="relative z-10 bg-[#091324]/90 backdrop-blur-md p-6 rounded-xl border border-red-500/50 text-center max-w-sm shadow-2xl">
                <CloudOff className="w-10 h-10 text-amber-400 mx-auto mb-2 animate-bounce" />
                <h4 className="font-display font-bold text-red-400 text-sm uppercase tracking-wide">
                  No usable data — cloud cover
                </h4>
                <p className="text-xs text-slate-300 font-mono mt-1.5 leading-relaxed">
                  Heavy stratus cloud deck obscures sea surface spectral bands. Surface oil reflection is completely blocked.
                </p>
                <div className="mt-3 text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  PASS TIME: 2026-09-06 06:12 UTC · S2B_MSIL1C
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#050b14] border-t border-slate-800/80 text-xs font-mono text-slate-400 flex justify-between">
            <span>Resolution: 10m/pixel</span>
            <span className="text-red-400">Status: Unusable</span>
          </div>
        </div>

        {/* SAR - Sentinel-1 (Clear Radar Detection) */}
        <div className="bg-[#071120] rounded-xl border border-cyan-900/60 overflow-hidden shadow-xl flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="p-4 bg-[#0a162b] border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-cyan-300 flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-cyan-400" />
                  SAR — Sentinel-1
                </h3>
                <p className="text-[11px] font-mono text-cyan-400/80">Synthetic Aperture Radar (C-Band VV/VH) · All-Weather</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2.5 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                CLEAR DETECTION
              </span>
            </div>

            {/* Simulated SAR Radar Image Container */}
            <div className="relative h-64 sm:h-72 bg-[#030914] overflow-hidden flex items-center justify-center">
              
              {/* Radar Noise / Backscatter Background */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(14, 165, 233, 0.15) 1px, transparent 1px)`,
                  backgroundSize: '8px 8px'
                }}
              />

              {/* Synthetic Dark Radar Oil Slick (Reduced Backscatter) */}
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 250">
                {/* Sea Surface Speckle Noise */}
                <rect width="400" height="250" fill="none" />
                
                {/* Dark Oil Slick Anomaly (Smoothed Surface Dampens Microwave Radar) */}
                <path 
                  d="M 140 100 Q 200 60, 260 80 T 320 120 Q 240 180, 160 160 Z" 
                  fill="#02050b" 
                  stroke={showMask ? "#ef4444" : "#0ea5e9"} 
                  strokeWidth="2"
                />

                {showMask && (
                  <>
                    <path 
                      d="M 150 105 Q 200 70, 250 88 T 305 122 Q 235 170, 168 152 Z" 
                      fill="rgba(239, 68, 68, 0.35)" 
                      stroke="#ef4444" 
                      strokeWidth="1.5" 
                      strokeDasharray="4 2"
                    />
                    <text x="180" y="125" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      SLICK DETECTED: 14.8 km²
                    </text>
                  </>
                )}

                {/* Vessel Target Radar Reflection Point */}
                <circle cx="325" cy="120" r="4" fill="#ef4444" />
                <circle cx="325" cy="120" r="10" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
                <text x="335" y="115" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  MV Solara (Hull Anomaly)
                </text>
              </svg>

              {/* Overlay Prompt Required Label */}
              <div className="absolute bottom-3 left-3 bg-[#071326]/90 backdrop-blur-md px-3 py-1.5 rounded border border-cyan-800/60 text-xs font-mono text-cyan-300">
                SAR (Sentinel-1) — clear detection, all-weather
              </div>
            </div>

          </div>

          {/* SAR Controls Bar */}
          <div className="p-3 bg-[#050b14] border-t border-slate-800/80 text-xs font-mono text-slate-300 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showMask} 
                  onChange={(e) => setShowMask(e.target.checked)}
                  className="accent-cyan-500 rounded"
                />
                <span>Overlay AI Mask</span>
              </label>
            </div>
            <div className="text-cyan-400">
              SAR Sensor: C-band IW GRD (20m Spatial)
            </div>
          </div>
        </div>

      </div>

      {/* EXPLANATION CARD: OIL VS LOOK-ALIKE CLASSIFICATION */}
      <div className="bg-gradient-to-br from-[#09152b] via-[#071122] to-[#0a1830] rounded-xl border border-cyan-900/50 p-6 shadow-xl">
        
        <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Oil vs Look-alike Classification
            </h3>
            <p className="text-xs font-mono text-slate-300 mt-1 max-w-3xl leading-relaxed">
              In SAR satellite radar images, natural phenomena such as algae blooms, calm-water low-wind zones, biogenic slicks, and rain cells create dark backscatter patches that resemble oil spills. The TIDEMARK AI classifier runs multi-spectral neural network inference to prevent false alarms.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 shrink-0">
            U-Net + ResNet-50 AI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#050d1a] p-3.5 rounded-lg border border-slate-800/80">
            <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">1. Geometric Shape</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Oil slicks exhibit sharp, trailing wake edges along vessel transit lanes, whereas algae blooms show feathered, fractal geometry.
            </p>
          </div>

          <div className="bg-[#050d1a] p-3.5 rounded-lg border border-slate-800/80">
            <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">2. Radar Texture</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Petroleum heavy slicks cause severe capillary wave dampening, producing consistent low radar backscatter dB values.
            </p>
          </div>

          <div className="bg-[#050d1a] p-3.5 rounded-lg border border-slate-800/80">
            <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">3. Wind-field Data</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Cross-referenced with ECMWF/NOAA 10m wind vectors (current wind: 14kts). Slicks remain visible above 3m/s threshold where calm zones disappear.
            </p>
          </div>

          <div className="bg-[#050d1a] p-3.5 rounded-lg border border-slate-800/80">
            <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">4. Historical Blooms</span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Cross-checked with seasonal phytoplankton databases (Copernicus Marine Service) for North Sea Sector 4B.
            </p>
          </div>
        </div>

        {/* AI Classifier Output Confidence Progress Bars */}
        <div className="bg-[#050c18] p-5 rounded-lg border border-cyan-900/40 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 font-bold">AI Model Output Confidence Breakdown</span>
            <span className="text-slate-400">Total Evaluated Anomaly: 14.8 km²</span>
          </div>

          {/* High Confidence Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-red-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                High confidence (Mineral Oil Spill): 91%
              </span>
              <span className="text-red-400 font-bold">91%</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-red-900/40">
              <div 
                className="bg-gradient-to-r from-red-600 to-amber-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_#ef4444]" 
                style={{ width: '91%' }}
              />
            </div>
          </div>

          {/* Possible Spill Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-amber-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Possible spill (Uncertain fringe): 6%
              </span>
              <span className="text-amber-300 font-bold">6%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-amber-900/40">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: '6%' }}
              />
            </div>
          </div>

          {/* Low Confidence / Look-alike Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Low confidence (Natural Look-alike): 3%
              </span>
              <span className="text-emerald-400 font-bold">3%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-emerald-900/40">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: '3%' }}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
