import React, { useState } from 'react';
import { 
  Satellite, 
  CloudOff, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { INCIDENT_DATA } from '../../data/mockData';

export default function SatelliteImageryView() {
  const [showMask, setShowMask] = useState(true);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <Satellite className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
            Satellite Remote Sensing & AI Segmentation
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Satellite Imagery & Classification
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Comparison between optical imagery and all-weather SAR radar data for oil spill extraction.
        </p>
      </div>

      {/* Side-By-Side Satellite Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Optical - Sentinel-2 (Cloud Impaired) */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
                  <CloudOff className="w-4 h-4 text-amber-400" />
                  Optical Sensor — Sentinel-2
                </h3>
                <p className="text-xs text-slate-400">Multi-Spectral Instrument (MSI) · True Color</p>
              </div>
              <span className="text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded-md">
                88.4% Cloud Cover
              </span>
            </div>

            {/* Simulated Cloud Image Container */}
            <div className="relative h-64 sm:h-72 bg-slate-900/60 flex items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-0 bg-slate-400/10 blur-md pointer-events-none" />

              {/* Notice overlay box */}
              <div className="relative z-10 bg-[#0f172a]/95 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/80 text-center max-w-sm shadow-md">
                <CloudOff className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h4 className="font-semibold text-amber-300 text-sm">
                  Surface View Obscured
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Dense cloud cover completely blocks visible optical bands, demonstrating why SAR radar is critical for 24/7 marine surveillance.
                </p>
                <div className="mt-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
                  Pass Time: 2026-09-06 06:12 UTC · S2B
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Resolution: 10m/pixel</span>
            <span className="text-amber-400 font-medium">Optical Impaired</span>
          </div>
        </div>

        {/* SAR - Sentinel-1 (Clear Radar Detection) */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-sky-300 flex items-center gap-2">
                  <Satellite className="w-4 h-4 text-sky-400" />
                  SAR Radar — Sentinel-1
                </h3>
                <p className="text-xs text-slate-400">Synthetic Aperture Radar (C-Band VV) · All-Weather</p>
              </div>
              <span className="text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Clear Detection
              </span>
            </div>

            {/* Simulated SAR Radar Image Container */}
            <div className="relative h-64 sm:h-72 bg-[#080e1a] overflow-hidden flex items-center justify-center">
              
              {/* Radar Noise / Backscatter Background */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(56, 189, 248, 0.15) 1px, transparent 1px)`,
                  backgroundSize: '10px 10px'
                }}
              />

              {/* Synthetic Dark Radar Oil Slick */}
              <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 250">
                <path 
                  d="M 140 100 Q 200 60, 260 80 T 320 120 Q 240 180, 160 160 Z" 
                  fill="#030712" 
                  stroke={showMask ? "#f43f5e" : "#0284c7"} 
                  strokeWidth="2"
                />

                {showMask && (
                  <>
                    <path 
                      d="M 150 105 Q 200 70, 250 88 T 305 122 Q 235 170, 168 152 Z" 
                      fill="rgba(244, 63, 94, 0.25)" 
                      stroke="#f43f5e" 
                      strokeWidth="1.5" 
                      strokeDasharray="4 2"
                    />
                    <text x="175" y="125" fill="#ffffff" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                      Extracted Slick: 14.8 km²
                    </text>
                  </>
                )}

                {/* Vessel Target Radar Reflection Point */}
                <circle cx="325" cy="120" r="4" fill="#f43f5e" />
                <circle cx="325" cy="120" r="9" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
                <text x="335" y="115" fill="#f43f5e" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                  MV Solara
                </text>
              </svg>

              <div className="absolute bottom-3 left-3 bg-[#0f172a]/95 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200">
                SAR Penetrates Clouds · 07:42 UTC
              </div>
            </div>

          </div>

          {/* SAR Controls Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
              <input 
                type="checkbox" 
                checked={showMask} 
                onChange={(e) => setShowMask(e.target.checked)}
                className="accent-sky-500 rounded"
              />
              <span>Overlay AI Segmentation Mask</span>
            </label>
            <div className="text-slate-400 font-mono text-xs">
              Sensor: Sentinel-1A C-band IW
            </div>
          </div>
        </div>

      </div>

      {/* Explanation Card: Oil vs Look-Alike Classification */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              Oil Spill vs Natural Look-Alike Classification
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              In radar imagery, natural phenomena like algal blooms, calm wind shadow zones, and organic slicks dampen capillary waves similarly to crude oil. The platform's AI pipeline correlates multiple environmental parameters to eliminate false positives.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-xl bg-sky-950 text-sky-300 border border-sky-800/60 shrink-0 font-medium">
            U-Net + ResNet-50
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-sky-400 font-semibold block mb-1">1. Geometric Shape</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              True slicks form distinct linear wakes aligned with shipping lanes, whereas natural slicks have feathered, fractal boundaries.
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-sky-400 font-semibold block mb-1">2. Radar Texture (dB)</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Viscous petroleum produces sustained, deep backscatter dampening (-8dB to -14dB drop) relative to ambient sea surface.
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-sky-400 font-semibold block mb-1">3. Wind Velocity</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cross-referenced with ECMWF 10m wind fields (14 kt recorded). Slicks remain intact while low-wind calm zones disperse.
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-sky-400 font-semibold block mb-1">4. Historical Blooms</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cross-checked with Copernicus marine biogeochemical records for chlorophyll-a and phytoplankton bloom anomalies.
            </p>
          </div>
        </div>

        {/* AI Classifier Confidence Output */}
        <div className="bg-slate-900/90 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-200 font-semibold">AI Model Confidence Distribution</span>
            <span className="text-slate-400">Evaluated Anomaly Area: {INCIDENT_DATA.baseSizeKm2} km²</span>
          </div>

          {/* High Confidence */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-rose-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Confirmed Mineral Oil Spill
              </span>
              <span className="text-rose-400 font-bold">91%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '91%' }} />
            </div>
          </div>

          {/* Possible Spill */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-amber-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Uncertain Perimeter Fringe
              </span>
              <span className="text-amber-300 font-bold">6%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '6%' }} />
            </div>
          </div>

          {/* Low Confidence / Look-alike */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Natural Biogenic Look-Alike
              </span>
              <span className="text-emerald-400 font-bold">3%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '3%' }} />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
