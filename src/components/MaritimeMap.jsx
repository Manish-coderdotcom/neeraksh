import React, { useState } from 'react';
import { 
  Layers, 
  Compass, 
  Maximize2, 
  RotateCcw, 
  Info, 
  Navigation, 
  AlertCircle, 
  ShieldAlert,
  Wind,
  Waves,
  Eye,
  EyeOff
} from 'lucide-react';
import { INCIDENT_DATA, VESSELS } from '../data/mockData';

export default function MaritimeMap({ 
  timelineProgress = 50, 
  selectedVesselId, 
  onSelectVessel 
}) {
  // Layer toggles
  const [layers, setLayers] = useState({
    sarBackscatter: true,
    aisTracks: true,
    driftForecast: true,
    chartGrid: true,
  });

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [activeTooltip, setActiveTooltip] = useState(null);

  // Dynamic oil spill polygon expansion calculation based on timeline slider (0 to 100)
  const growthFactor = 0.8 + (timelineProgress / 100) * 0.6;
  const currentSlickKm2 = (INCIDENT_DATA.baseSizeKm2 * growthFactor).toFixed(1);

  // Map coordinates conversion to SVG viewport (800 x 500)
  // Lat: 61.10°N to 61.70°N (delta = 0.60) -> Y: 460 to 40
  // Lng: 3.70°E to 4.70°E (delta = 1.00) -> X: 40 to 760
  const latToY = (lat) => 460 - ((lat - 61.10) / 0.60) * 420;
  const lngToX = (lng) => 40 + ((lng - 3.70) / 1.00) * 720;

  const selectedVessel = VESSELS.find(v => v.id === selectedVesselId) || VESSELS[0];

  return (
    <div className="relative rounded-xl border border-cyan-900/50 bg-[#040b17] overflow-hidden shadow-2xl group">
      
      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Status & Coordinate info */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#061224]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-900/50 text-xs font-mono text-cyan-300 shadow-lg">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>NORWEGIAN SEA · SECTOR 4B</span>
          <span className="text-slate-500">|</span>
          <span className="text-white font-semibold">{INCIDENT_DATA.location}</span>
        </div>

        {/* Right Layer Controls Dropdown / Controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#061224]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-900/50 text-xs font-mono text-slate-200 shadow-lg">
          <Layers className="w-3.5 h-3.5 text-cyan-400 mr-1" />
          
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-cyan-300 transition-colors">
            <input 
              type="checkbox" 
              checked={layers.sarBackscatter} 
              onChange={() => toggleLayer('sarBackscatter')}
              className="rounded accent-cyan-500 w-3.5 h-3.5"
            />
            <span>SAR backscatter</span>
          </label>

          <span className="text-slate-600">|</span>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-cyan-300 transition-colors">
            <input 
              type="checkbox" 
              checked={layers.aisTracks} 
              onChange={() => toggleLayer('aisTracks')}
              className="rounded accent-cyan-500 w-3.5 h-3.5"
            />
            <span>AIS tracks</span>
          </label>

          <span className="text-slate-600">|</span>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-cyan-300 transition-colors">
            <input 
              type="checkbox" 
              checked={layers.driftForecast} 
              onChange={() => toggleLayer('driftForecast')}
              className="rounded accent-cyan-500 w-3.5 h-3.5"
            />
            <span>Drift forecast</span>
          </label>

          <span className="text-slate-600">|</span>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-cyan-300 transition-colors">
            <input 
              type="checkbox" 
              checked={layers.chartGrid} 
              onChange={() => toggleLayer('chartGrid')}
              className="rounded accent-cyan-500 w-3.5 h-3.5"
            />
            <span>Chart grid</span>
          </label>
        </div>

      </div>

      {/* Main Interactive SVG Canvas Map */}
      <div className="w-full h-[460px] lg:h-[520px] bg-[#050c1a] relative overflow-hidden cursor-crosshair select-none">
        
        <svg 
          viewBox="0 0 800 500" 
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Dark radar ocean gradient */}
            <radialGradient id="oceanBathymetry" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0a192f" />
              <stop offset="60%" stopColor="#061021" />
              <stop offset="100%" stopColor="#030712" />
            </radialGradient>

            {/* Oil slick dark gradient */}
            <radialGradient id="slickGradient" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#31103f" stopOpacity="0.85" />
              <stop offset="85%" stopColor="#0f172a" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
            </radialGradient>

            {/* SAR Radar Sweep Effect Pattern */}
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(14, 165, 233, 0.08)" strokeWidth="1" />
            </pattern>

            {/* High confidence alert pulse filter */}
            <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ocean Base Layer */}
          <rect width="800" height="500" fill="url(#oceanBathymetry)" />
          
          {/* Chart Grid Lines & Lat/Lng Markings */}
          {layers.chartGrid && (
            <g className="chart-grid">
              <rect width="800" height="500" fill="url(#gridPattern)" />
              
              {/* Latitude lines */}
              <line x1="40" y1="100" x2="760" y2="100" stroke="rgba(14, 165, 233, 0.15)" strokeDasharray="3 3" />
              <text x="45" y="95" fill="rgba(14, 165, 233, 0.5)" fontSize="10" fontFamily="monospace">61.50°N</text>

              <line x1="40" y1="240" x2="760" y2="240" stroke="rgba(14, 165, 233, 0.15)" strokeDasharray="3 3" />
              <text x="45" y="235" fill="rgba(14, 165, 233, 0.5)" fontSize="10" fontFamily="monospace">61.38°N (Origin Parallel)</text>

              <line x1="40" y1="380" x2="760" y2="380" stroke="rgba(14, 165, 233, 0.15)" strokeDasharray="3 3" />
              <text x="45" y="375" fill="rgba(14, 165, 233, 0.5)" fontSize="10" fontFamily="monospace">61.20°N</text>

              {/* Longitude lines */}
              <line x1="180" y1="40" x2="180" y2="460" stroke="rgba(14, 165, 233, 0.15)" strokeDasharray="3 3" />
              <text x="185" y="475" fill="rgba(14, 165, 233, 0.5)" fontSize="10" fontFamily="monospace">3.90°E</text>

              <line x1="380" y1="40" x2="380" y2="460" stroke="rgba(14, 165, 233, 0.15)" strokeDasharray="3 3" />
              <text x="385" y="475" fill="rgba(14, 165, 233, 0.5)" fontSize="10" fontFamily="monospace">4.18°E</text>

              <line x1="580" y1="40" x2="580" y2="460" stroke="rgba(14, 165, 233, 0.15)" strokeDasharray="3 3" />
              <text x="585" y="475" fill="rgba(14, 165, 233, 0.5)" fontSize="10" fontFamily="monospace">4.45°E</text>
            </g>
          )}

          {/* SAR Radar Backscatter Mask Layer */}
          {layers.sarBackscatter && (
            <g className="sar-layer opacity-40">
              {/* Radar pass swath bounds */}
              <polygon points="60,30 740,70 710,470 30,430" fill="none" stroke="rgba(6, 182, 212, 0.3)" strokeDasharray="4 4" strokeWidth="1" />
              <text x="70" y="55" fill="#06b6d4" fontSize="10" fontFamily="monospace" opacity="0.8">
                SENTINEL-1A SWATH PASS · SAR BACKSCATTER dB RATIO
              </text>
            </g>
          )}

          {/* Drift Forecast Corridor */}
          {layers.driftForecast && (
            <g className="drift-corridor opacity-60">
              {/* Triangular drift expansion cone based on SW wind 215° */}
              <polygon 
                points="340,240 560,110 630,160 380,260" 
                fill="rgba(245, 158, 11, 0.12)" 
                stroke="rgba(245, 158, 11, 0.4)" 
                strokeDasharray="4 4" 
                strokeWidth="1.5"
              />
              <path d="M 340 240 L 595 135" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 3" />
              <text x="480" y="165" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
                DRIFT FORECAST VECTOR (215° @ 14kt)
              </text>
            </g>
          )}

          {/* OIL SPILL POLYGON (Dynamic expansion based on timeline) */}
          <g className="oil-slick-polygon">
            {/* Outer low confidence slick boundary */}
            <path 
              d={`M ${340 - 20*growthFactor} ${240 - 15*growthFactor} 
                 Q ${390 + 30*growthFactor} ${210 - 20*growthFactor}, ${440 + 40*growthFactor} ${200 - 10*growthFactor} 
                 T ${480 + 50*growthFactor} ${220 + 20*growthFactor} 
                 Q ${410 + 20*growthFactor} ${270 + 25*growthFactor}, ${350 - 10*growthFactor} ${250 + 15*growthFactor} Z`}
              fill="rgba(239, 68, 68, 0.25)"
              stroke="rgba(239, 68, 68, 0.5)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            {/* Core high-confidence dark oil slick */}
            <path 
              d={`M ${345 - 12*growthFactor} ${242 - 8*growthFactor} 
                 Q ${385 + 20*growthFactor} ${215 - 12*growthFactor}, ${435 + 25*growthFactor} ${205 - 5*growthFactor} 
                 T ${470 + 35*growthFactor} ${222 + 12*growthFactor} 
                 Q ${405 + 15*growthFactor} ${262 + 18*growthFactor}, ${352 - 5*growthFactor} ${248 + 8*growthFactor} Z`}
              fill="url(#slickGradient)"
              stroke="#ef4444"
              strokeWidth="2"
              filter="url(#glowRed)"
            />

            {/* Slick Label */}
            <text x="390" y="235" fill="#fca5a5" fontSize="11" fontFamily="monospace" fontWeight="bold">
              OIL SLICK: {currentSlickKm2} km²
            </text>
            <text x="390" y="248" fill="#ef4444" fontSize="9" fontFamily="monospace">
              91% High Confidence
            </text>
          </g>

          {/* Spill Origin Ring Marker */}
          <g className="spill-origin">
            <circle cx="340" cy="240" r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3">
              <animate attributeName="r" values="8;18;8" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="340" cy="240" r="4" fill="#ef4444" />
            
            <line x1="340" y1="240" x2="310" y2="290" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
            <rect x="230" y="290" width="130" height="28" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="1" />
            <text x="238" y="304" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
              ESTIMATED ORIGIN
            </text>
            <text x="238" y="314" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
              61.38°N, 4.12°E (05:42 UTC)
            </text>
          </g>

          {/* AIS VESSEL TRACKS & MARKERS */}
          {layers.aisTracks && VESSELS.map((vessel) => {
            const isSelected = vessel.id === selectedVesselId;
            const isSuspect = vessel.id === "solara";
            
            // Map tracks coordinates to SVG
            let pathString = "";
            let currentPos = { x: 0, y: 0 };
            
            if (vessel.id === "solara") {
              // MV Solara Track: enters from SW, gap at origin, reappears NE
              const startX = lngToX(4.02), startY = latToY(61.30);
              const originX = lngToX(4.12), originY = latToY(61.38);
              const endX = lngToX(4.40), endY = latToY(61.60);
              currentPos = { x: endX, y: endY };

              return (
                <g key={vessel.id} className="vessel-solara-track">
                  {/* Track line before transponder gap */}
                  <line x1={startX} y1={startY} x2={originX} y2={originY} stroke="#06b6d4" strokeWidth="2.5" />
                  
                  {/* Transponder GAP dotted line */}
                  <line x1={originX} y1={originY} x2={endX} y2={endY} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 4" />
                  
                  <text x={(originX + endX)/2 - 40} y={(originY + endY)/2 - 10} fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    ⚠️ AIS TRANSPONDER GAP (T-2.0h)
                  </text>

                  {/* Vessel Marker at current position */}
                  <g 
                    transform={`translate(${endX}, ${endY}) rotate(42)`} 
                    className="cursor-pointer"
                    onClick={() => onSelectVessel(vessel.id)}
                  >
                    {/* Pulsing hazard halo */}
                    <circle cx="0" cy="0" r="16" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5">
                      <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
                    </circle>
                    
                    {/* Ship Polygon Icon */}
                    <polygon points="0,-12 6,8 0,5 -6,8" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  </g>

                  {/* Vessel Tag Label */}
                  <g transform={`translate(${endX + 15}, ${endY - 15})`} className="cursor-pointer" onClick={() => onSelectVessel(vessel.id)}>
                    <rect width="120" height="34" rx="4" fill="#0f172a" stroke={isSelected ? "#06b6d4" : "#ef4444"} strokeWidth="1.5" />
                    <text x="8" y="14" fill="#ffffff" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                      MV Solara 🔴
                    </text>
                    <text x="8" y="26" fill="#ef4444" fontSize="9" fontFamily="monospace">
                      SCORE: 91/100 · 17.4kt
                    </text>
                  </g>
                </g>
              );
            } else if (vessel.id === "helios") {
              const x1 = lngToX(4.30), y1 = latToY(61.25);
              const x2 = lngToX(4.65), y2 = latToY(61.32);
              currentPos = { x: x2, y: y2 };

              return (
                <g key={vessel.id}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                  <g transform={`translate(${x2}, ${y2}) rotate(95)`} className="cursor-pointer" onClick={() => onSelectVessel(vessel.id)}>
                    <polygon points="0,-10 5,6 0,4 -5,6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                  </g>
                  <g transform={`translate(${x2 + 10}, ${y2 - 10})`} className="cursor-pointer" onClick={() => onSelectVessel(vessel.id)}>
                    <rect width="90" height="24" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                    <text x="6" y="15" fill="#fcd34d" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                      Helios Star (34)
                    </text>
                  </g>
                </g>
              );
            } else if (vessel.id === "nordic") {
              const x1 = lngToX(3.90), y1 = latToY(61.10);
              const x2 = lngToX(4.10), y2 = latToY(61.50);
              currentPos = { x: x2, y: y2 };

              return (
                <g key={vessel.id}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10b981" strokeWidth="1.5" />
                  <g transform={`translate(${x2}, ${y2}) rotate(28)`} className="cursor-pointer" onClick={() => onSelectVessel(vessel.id)}>
                    <polygon points="0,-10 5,6 0,4 -5,6" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                  </g>
                  <g transform={`translate(${x2 - 95}, ${y2 - 10})`} className="cursor-pointer" onClick={() => onSelectVessel(vessel.id)}>
                    <rect width="90" height="24" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="6" y="15" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                      Nordic Carrier (18)
                    </text>
                  </g>
                </g>
              );
            } else if (vessel.id === "pacific") {
              const x1 = lngToX(3.80), y1 = latToY(61.70);
              const x2 = lngToX(3.75), y2 = latToY(61.20);
              currentPos = { x: x2, y: y2 };

              return (
                <g key={vessel.id}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10b981" strokeWidth="1.5" />
                  <g transform={`translate(${x2}, ${y2}) rotate(185)`} className="cursor-pointer" onClick={() => onSelectVessel(vessel.id)}>
                    <polygon points="0,-10 5,6 0,4 -5,6" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                  </g>
                  <g transform={`translate(${x2 + 10}, ${y2 + 5})`} className="cursor-pointer" onClick={() => onSelectVessel(vessel.id)}>
                    <rect width="95" height="24" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="6" y="15" fill="#6ee7b7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                      Pacific Voyager (12)
                    </text>
                  </g>
                </g>
              );
            } else if (vessel.id === "coastguard") {
              const x1 = lngToX(4.60), y1 = latToY(61.15);
              const x2 = lngToX(4.45), y2 = latToY(61.55);

              return (
                <g key={vessel.id}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                  <g transform={`translate(${x2}, ${y2}) rotate(310)`} className="cursor-pointer" onClick={() => onSelectVessel(vessel.id)}>
                    <polygon points="0,-12 6,8 0,5 -6,8" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                  <g transform={`translate(${x2 - 125}, ${y2 - 25})`} className="cursor-pointer" onClick={() => onSelectVessel(vessel.id)}>
                    <rect width="120" height="26" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="6" y="16" fill="#93c5fd" fontSize="9" fontFamily="sans-serif" fontWeight="bold">
                      Coastal Guard 14 🛡️
                    </text>
                  </g>
                </g>
              );
            }

            return null;
          })}

          {/* Compass Rose Overlay */}
          <g transform="translate(740, 430)" className="opacity-80">
            <circle cx="0" cy="0" r="22" fill="#07152b" stroke="#06b6d4" strokeWidth="1" />
            <line x1="0" y1="-20" x2="0" y2="20" stroke="#06b6d4" strokeWidth="1" />
            <line x1="-20" y1="0" x2="20" y2="0" stroke="#06b6d4" strokeWidth="1" />
            <text x="-4" y="-10" fill="#06b6d4" fontSize="9" fontFamily="monospace" fontWeight="bold">N</text>
          </g>

        </svg>

      </div>

      {/* Bottom Map Legend Bar */}
      <div className="bg-[#050f1f] border-t border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-3">
        
        {/* Attribution Legend */}
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
            Attribution Confidence:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
            <span>Red = High (MV Solara: 91/100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span>
            <span>Amber = Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
            <span>Green = Low</span>
          </div>
        </div>

        {/* Selected Vessel Quick Indicator */}
        <div className="flex items-center gap-2 bg-[#091830] px-2.5 py-1 rounded border border-cyan-800/50">
          <span className="text-slate-400 text-[11px]">Selected:</span>
          <span className="text-cyan-300 font-bold">{selectedVessel.name}</span>
          <span className="text-slate-500">({selectedVessel.type})</span>
        </div>

      </div>

    </div>
  );
}
