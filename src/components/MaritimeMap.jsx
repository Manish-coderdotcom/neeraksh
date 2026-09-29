import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Compass, 
  RotateCcw, 
  Info, 
  Navigation, 
  AlertCircle, 
  ShieldAlert, 
  Wind, 
  Waves, 
  Eye, 
  EyeOff,
  Ship,
  Fish,
  Trees,
  Crosshair,
  TrendingUp,
  Sliders,
  Play,
  Pause,
  Anchor,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { INCIDENT_PROFILE, PREDICTION_TIMELINE, ECOSYSTEM_ZONES, CANDIDATE_VESSELS } from '../data/simulationData';
import { useMaritime } from '../context/MaritimeContext';

export default function MaritimeMap({ 
  timelineProgress = 45, 
  selectedVesselId = 'solara', 
  onSelectVessel 
}) {
  const context = useMaritime();
  const currentIncident = context?.currentIncident || INCIDENT_PROFILE;
  const openEntityModal = context?.openEntityModal;

  // Layer toggles
  const [layers, setLayers] = useState({
    sarBackscatter: true,
    aisTracks: true,
    driftForecast: true,
    futureImpacts: true,
    currentVectors: true,
    chartGrid: true,
    radarSweep: true,
  });

  const [cursorPos, setCursorPos] = useState({ lat: 61.42, lng: 4.18 });
  const [activeConsequence, setActiveConsequence] = useState(null);
  const [isSimulatingSlick, setIsSimulatingSlick] = useState(true);
  const [hoveredImpact, setHoveredImpact] = useState(null);

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Dynamic growth factor based on timelineProgress (0 to 100)
  const growthFactor = 0.8 + (timelineProgress / 100) * 0.7;
  const currentSlickKm2 = (14.8 * growthFactor).toFixed(1);

  // Coordinate conversion to SVG viewport (820 x 520)
  // Lat: 61.05°N to 62.00°N (delta = 0.95)
  // Lng: 3.60°E to 5.25°E (delta = 1.65)
  const latToY = (lat) => 470 - ((lat - 61.05) / 0.95) * 420;
  const lngToX = (lng) => 60 + ((lng - 3.60) / 1.65) * 700;

  // Ship Position calculation along track based on timelineProgress (0 - 100)
  // At 0%: 61.30, 4.02 (05:00 UTC)
  // At 18%: 61.38, 4.12 (05:42 UTC - leak onset / transponder gap)
  // At 45%: 61.58, 4.38 (07:42 UTC - SAR pass / slick detection)
  // At 100%: 61.85, 4.70 (11:00 UTC)
  const calculateShipPos = (p) => {
    if (p <= 18) {
      const t = p / 18;
      return {
        lat: 61.30 + (61.38 - 61.30) * t,
        lng: 4.02 + (4.12 - 4.02) * t,
        heading: 42,
        speed: 11.0,
        leaking: false,
      };
    } else if (p <= 45) {
      const t = (p - 18) / (45 - 18);
      return {
        lat: 61.38 + (61.58 - 61.38) * t,
        lng: 4.12 + (4.38 - 4.12) * t,
        heading: 42,
        speed: 14.5,
        leaking: true, // During blackout gap, active discharge
      };
    } else {
      const t = (p - 45) / (100 - 45);
      return {
        lat: 61.58 + (61.85 - 61.58) * t,
        lng: 4.38 + (4.70 - 4.38) * t,
        heading: 42,
        speed: 17.4,
        leaking: false, // Trailing sheen
      };
    }
  };

  const shipState = calculateShipPos(timelineProgress);
  const shipX = lngToX(shipState.lng);
  const shipY = latToY(shipState.lat);

  // Spill Origin (Fixed at calculated leak onset coordinates)
  const originX = lngToX(4.12);
  const originY = latToY(61.38);

  // Future Consequence Impact Targets
  const IMPACT_SITES = [
    {
      id: 'fishery',
      name: 'Herring Spawning Ground #12',
      category: 'Commercial Pelagic Fishery',
      lat: 61.58,
      lng: 4.52,
      etaHours: 14,
      severity: 'CRITICAL',
      color: '#ef4444',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
      lossEstimate: '$18.4M Economic Loss',
      description: 'Massive embryonic toxicity in pelagic herring egg clutches; immediate commercial catch prohibition required.',
      response: 'Deploy acoustic deterrents; issue emergency trawler exclusion notice.',
      icon: Fish,
    },
    {
      id: 'coral',
      name: 'Lophelia Coral Bioherm #4',
      category: 'Cold-Water Coral Reef (220m depth)',
      lat: 61.72,
      lng: 4.78,
      etaHours: 28,
      severity: 'CRITICAL',
      color: '#ef4444',
      badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
      lossEstimate: 'Benthic Bioherm Smothering',
      description: 'Heavy hydrocarbon sedimentation risks suffocating centuries-old Lophelia pertusa skeletal reefs.',
      response: 'Subsea deflection bubble curtains; 5 NM buffer zone for chemical dispersants.',
      icon: Trees,
    },
    {
      id: 'coastline',
      name: 'Vestland Coastal Nature Reserve',
      category: 'Seabird Colonies & Outer Skerries',
      lat: 61.92,
      lng: 5.10,
      etaHours: 50,
      severity: 'HIGH THREAT',
      color: '#f97316',
      badgeColor: 'bg-orange-950 text-orange-300 border-orange-800',
      lossEstimate: '88.5% Landfall Probability (68h)',
      description: 'Severe feather hypothermia and ingestion fatality across Atlantic Puffin and Kittiwake nesting colonies.',
      response: 'Pre-position 2,400m coastal deflection booms across Outer Fedje and Florø.',
      icon: ShieldAlert,
    },
    {
      id: 'aquaculture',
      name: 'Sognefjord Aquaculture Zone',
      category: 'Salmonid Sea-Cage Facilities',
      lat: 61.12,
      lng: 5.05,
      etaHours: 64,
      severity: 'MODERATE THREAT',
      color: '#eab308',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
      lossEstimate: '$6.5M Sea-Cage Exposure',
      description: 'Oily surface sheen entering fjord mouth threatens commercial Atlantic salmon sea-pens.',
      response: 'Deploy fjord entry pneumatic barriers and surface skimmer barricades.',
      icon: Anchor,
    },
  ];

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-[#060e1d] overflow-hidden shadow-xl group">
      
      {/* Top Map Tactical Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Status & Coordinate info */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#091326]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/80 text-xs font-sans text-slate-200 shadow-lg">
          <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-semibold text-white">TACTICAL OCEAN VECTOR VIEW</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-300 font-mono text-[11px]">{currentIncident.locationFormatted || '61.4200° N, 04.1800° E'}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-mono text-[11px]">Cursor: {cursorPos.lat}°N, {cursorPos.lng}°E</span>
        </div>

        {/* Right Layer Controls */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2.5 bg-[#091326]/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-sans text-slate-300 shadow-lg">
          <Layers className="w-3.5 h-3.5 text-cyan-400 mr-0.5 shrink-0" />
          
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input 
              type="checkbox" 
              checked={layers.futureImpacts} 
              onChange={() => toggleLayer('futureImpacts')}
              className="rounded accent-rose-500 w-3.5 h-3.5"
            />
            <span className="text-rose-300 font-medium">Future Impacts</span>
          </label>

          <span className="text-slate-600">|</span>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input 
              type="checkbox" 
              checked={layers.driftForecast} 
              onChange={() => toggleLayer('driftForecast')}
              className="rounded accent-amber-500 w-3.5 h-3.5"
            />
            <span>72h Drift</span>
          </label>

          <span className="text-slate-600">|</span>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input 
              type="checkbox" 
              checked={layers.currentVectors} 
              onChange={() => toggleLayer('currentVectors')}
              className="rounded accent-cyan-500 w-3.5 h-3.5"
            />
            <span>Current Flow</span>
          </label>

          <span className="text-slate-600">|</span>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input 
              type="checkbox" 
              checked={layers.radarSweep} 
              onChange={() => toggleLayer('radarSweep')}
              className="rounded accent-sky-500 w-3.5 h-3.5"
            />
            <span>Radar Sweep</span>
          </label>
        </div>

      </div>

      {/* Main Interactive Tactical SVG Ocean Canvas */}
      <div className="w-full h-[520px] lg:h-[620px] bg-[#040915] relative overflow-hidden select-none">
        
        <svg 
          viewBox="0 0 820 520" 
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 820;
            const y = ((e.clientY - rect.top) / rect.height) * 520;
            const lng = 3.60 + ((x - 60) / 700) * 1.65;
            const lat = 61.05 + ((470 - y) / 420) * 0.95;
            setCursorPos({ lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)) });
          }}
        >
          <defs>
            {/* Deep ocean bathymetry radial gradient */}
            <radialGradient id="tacticalOcean" cx="45%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#08182f" />
              <stop offset="45%" stopColor="#051124" />
              <stop offset="100%" stopColor="#020610" />
            </radialGradient>

            {/* Pulsing slick gradient with thickness heat map */}
            <radialGradient id="slickHeatMap" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#020617" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#1e1b4b" stopOpacity="0.88" />
              <stop offset="70%" stopColor="#450a0a" stopOpacity="0.75" />
              <stop offset="95%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
            </radialGradient>

            {/* Glowing red hazard filter */}
            <filter id="hazardGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Glowing cyan radar filter */}
            <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Grid pattern */}
            <pattern id="nauticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" />
            </pattern>

            {/* Current Flow Streamline Arrow Marker */}
            <marker id="currentArrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <polygon points="0,1 5,3 0,5" fill="rgba(6, 182, 212, 0.45)" />
            </marker>

            {/* Future Consequence Threat Vector Arrow Marker */}
            <marker id="threatArrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <polygon points="0,1.5 6,3.5 0,5.5" fill="#ef4444" />
            </marker>
          </defs>

          {/* Ocean Base Layer */}
          <rect width="820" height="520" fill="url(#tacticalOcean)" />
          
          {/* Nautical Grid Lines */}
          {layers.chartGrid && (
            <g className="chart-grid">
              <rect width="820" height="520" fill="url(#nauticalGrid)" />
              
              {/* Latitude parallels */}
              <line x1="50" y1="120" x2="780" y2="120" stroke="rgba(14, 165, 233, 0.12)" strokeDasharray="3 3" />
              <text x="55" y="115" fill="rgba(14, 165, 233, 0.45)" fontSize="10" fontFamily="monospace">61.80°N (MPA Parallel)</text>

              <line x1="50" y1="260" x2="780" y2="260" stroke="rgba(14, 165, 233, 0.12)" strokeDasharray="3 3" />
              <text x="55" y="255" fill="rgba(14, 165, 233, 0.45)" fontSize="10" fontFamily="monospace">61.42°N (Spill Parallel)</text>

              <line x1="50" y1="400" x2="780" y2="400" stroke="rgba(14, 165, 233, 0.12)" strokeDasharray="3 3" />
              <text x="55" y="395" fill="rgba(14, 165, 233, 0.45)" fontSize="10" fontFamily="monospace">61.10°N</text>

              {/* Longitude meridians */}
              <line x1="220" y1="40" x2="220" y2="480" stroke="rgba(14, 165, 233, 0.12)" strokeDasharray="3 3" />
              <text x="225" y="495" fill="rgba(14, 165, 233, 0.45)" fontSize="10" fontFamily="monospace">4.00°E</text>

              <line x1="440" y1="40" x2="440" y2="480" stroke="rgba(14, 165, 233, 0.12)" strokeDasharray="3 3" />
              <text x="445" y="495" fill="rgba(14, 165, 233, 0.45)" fontSize="10" fontFamily="monospace">4.50°E</text>

              <line x1="660" y1="40" x2="660" y2="480" stroke="rgba(14, 165, 233, 0.12)" strokeDasharray="3 3" />
              <text x="665" y="495" fill="rgba(14, 165, 233, 0.45)" fontSize="10" fontFamily="monospace">5.00°E (Coastline Fairway)</text>
            </g>
          )}

          {/* Norwegian Coastline Shoreline Representation (Eastern Edge) */}
          <g className="coastline-layer opacity-70">
            <path
              d="M 680,20 Q 695,80 685,150 T 710,240 Q 725,320 690,390 T 705,500 L 820,500 L 820,20 Z"
              fill="#0d1b30"
              stroke="#1e3a5f"
              strokeWidth="1.5"
            />
            {/* Outer Skerries & Fjord Islands */}
            <circle cx="670" cy="140" r="5" fill="#142642" stroke="#1e3a5f" />
            <circle cx="678" cy="195" r="7" fill="#142642" stroke="#1e3a5f" />
            <circle cx="665" cy="310" r="6" fill="#142642" stroke="#1e3a5f" />
            <text x="730" y="270" fill="rgba(148, 163, 184, 0.5)" fontSize="11" fontFamily="sans-serif" fontWeight="bold" letterSpacing="3">
              NORWAY COAST
            </text>
          </g>

          {/* Animated Hydrodynamic Ocean Current Streamlines (045° NE @ 1.25 kts) */}
          {layers.currentVectors && (
            <g className="current-vectors-streamlines opacity-65">
              {[
                { x: 120, y: 380, len: 110 },
                { x: 260, y: 440, len: 130 },
                { x: 180, y: 220, len: 140 },
                { x: 380, y: 320, len: 125 },
                { x: 320, y: 150, len: 140 },
                { x: 500, y: 260, len: 115 },
                { x: 440, y: 90, len: 130 },
                { x: 580, y: 390, len: 120 },
              ].map((cv, idx) => (
                <g key={idx}>
                  <line 
                    x1={cv.x} 
                    y1={cv.y} 
                    x2={cv.x + cv.len * 0.7} 
                    y2={cv.y - cv.len * 0.7} 
                    stroke="rgba(6, 182, 212, 0.4)" 
                    strokeWidth="1.5" 
                    strokeDasharray="8 6" 
                    markerEnd="url(#currentArrow)"
                  >
                    <animate 
                      attributeName="stroke-dashoffset" 
                      values="28;0" 
                      dur={`${2.2 + idx * 0.3}s`} 
                      repeatCount="indefinite" 
                    />
                  </line>
                </g>
              ))}
              <text x="140" y="395" fill="rgba(6, 182, 212, 0.75)" fontSize="9" fontFamily="monospace">
                TIDAL CURRENT: 045° @ 1.25 KT ↗
              </text>
            </g>
          )}

          {/* Rotating Radar Scanner Sweep */}
          {layers.radarSweep && (
            <g transform="translate(410, 260)" className="pointer-events-none opacity-40">
              <circle cx="0" cy="0" r="240" fill="none" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="1" strokeDasharray="3 5" />
              <line x1="0" y1="0" x2="240" y2="0" stroke="rgba(56, 189, 248, 0.8)" strokeWidth="2" filter="url(#cyanGlow)">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 0 0"
                  to="360 0 0"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
          )}

          {/* 72-Hour Hydrodynamic Drift Corridor Ribbon */}
          {layers.driftForecast && (
            <g className="drift-corridor">
              {/* Expanding Consequence Dispersion Cone */}
              <polygon
                points={`${originX},${originY} ${lngToX(5.15)},${latToY(61.98)} ${lngToX(5.25)},${latToY(61.85)} ${originX + 25},${originY + 20}`}
                fill="rgba(249, 115, 22, 0.08)"
                stroke="rgba(249, 115, 22, 0.35)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />

              {/* Waypoint Trajectory Track */}
              <path
                d={`M ${originX} ${originY} 
                   L ${lngToX(4.29)} ${latToY(61.47)} 
                   L ${lngToX(4.41)} ${latToY(61.53)} 
                   L ${lngToX(4.62)} ${latToY(61.64)} 
                   L ${lngToX(4.95)} ${latToY(61.82)} 
                   L ${lngToX(5.22)} ${latToY(61.98)}`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                filter="url(#cyanGlow)"
              />

              {/* Waypoint Time Horizon Nodes */}
              {PREDICTION_TIMELINE.map((wp, idx) => {
                const wx = lngToX(wp.coordinates.lng);
                const wy = latToY(wp.coordinates.lat);

                return (
                  <g key={wp.horizonKey} className="cursor-pointer" onClick={() => onSelectVessel(selectedVesselId)}>
                    <circle cx={wx} cy={wy} r={idx === 0 ? 5 : 4} fill={idx > 3 ? "#ef4444" : "#38bdf8"} stroke="#ffffff" strokeWidth="1" />
                    <text x={wx + 6} y={wy - 6} fill="#94a3b8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      {wp.horizonKey}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* DYNAMIC OIL SPILL SLICK POLYGON (Expanding from leak onset) */}
          <g 
            className="oil-slick-layer cursor-pointer group" 
            onClick={() => openEntityModal && openEntityModal('SPILL', currentIncident)}
            title="Click to inspect oil spill telemetry"
          >
            {/* Outer low-viscosity sheen fringe */}
            <path 
              d={`M ${originX - 25*growthFactor} ${originY - 18*growthFactor} 
                 Q ${originX + 40*growthFactor} ${originY - 30*growthFactor}, ${originX + 90*growthFactor} ${originY - 20*growthFactor} 
                 T ${originX + 140*growthFactor} ${originY + 15*growthFactor} 
                 Q ${originX + 80*growthFactor} ${originY + 45*growthFactor}, ${originX - 10*growthFactor} ${originY + 25*growthFactor} Z`}
              fill="rgba(239, 68, 68, 0.18)"
              stroke="rgba(239, 68, 68, 0.5)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            >
              <animate 
                attributeName="opacity" 
                values="0.7;0.95;0.7" 
                dur="4s" 
                repeatCount="indefinite" 
              />
            </path>

            {/* Dense emulsified crude core */}
            <path 
              d={`M ${originX - 14*growthFactor} ${originY - 10*growthFactor} 
                 Q ${originX + 30*growthFactor} ${originY - 18*growthFactor}, ${originX + 75*growthFactor} ${originY - 12*growthFactor} 
                 T ${originX + 115*growthFactor} ${originY + 10*growthFactor} 
                 Q ${originX + 65*growthFactor} ${originY + 30*growthFactor}, ${originX - 5*growthFactor} ${originY + 16*growthFactor} Z`}
              fill="url(#slickHeatMap)"
              stroke="#ef4444"
              strokeWidth="2"
              filter="url(#hazardGlow)"
            />

            {/* Slick Expansion Label */}
            <text x={originX + 35} y={originY - 15} fill="#fca5a5" fontSize="11" fontFamily="monospace" fontWeight="bold">
              OIL SLICK: {currentSlickKm2} km² (Click to Inspect)
            </text>
            <text x={originX + 35} y={originY - 2} fill="#ef4444" fontSize="9" fontFamily="monospace">
              Heavy Crude · 550 bbl (Viscosity 185 cSt)
            </text>
          </g>

          {/* Spill Leak Origin Pulse Ring */}
          <g className="leak-origin-beacon">
            <circle cx={originX} cy={originY} r="16" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3">
              <animate attributeName="r" values="8;24;8" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.2;1" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx={originX} cy={originY} r="4" fill="#ef4444" />
            <text x={originX - 85} y={originY + 22} fill="#f87171" fontSize="9" fontFamily="monospace" fontWeight="bold">
              LEAK ONSET (05:42 UTC)
            </text>
          </g>

          {/* ============================================================ */}
          {/* FUTURE IMPACT SITES & DIRECT PROJECTION CONES FROM THE SPILL */}
          {/* ============================================================ */}
          {layers.futureImpacts && IMPACT_SITES.map((site) => {
            const sx = lngToX(site.lng);
            const sy = latToY(site.lat);
            const isHovered = hoveredImpact === site.id;

            return (
              <g key={site.id} className="future-impact-target">
                
                {/* Dynamic animated threat trajectory arc connecting Ship to Consequence Site */}
                <path
                  d={`M ${shipX} ${shipY} Q ${(shipX + sx)/2 + 20} ${(shipY + sy)/2 - 30} ${sx} ${sy}`}
                  fill="none"
                  stroke={site.color}
                  strokeWidth={isHovered ? "2.5" : "1.8"}
                  strokeDasharray="5 4"
                  markerEnd="url(#threatArrow)"
                  filter={site.severity === 'CRITICAL' ? "url(#hazardGlow)" : undefined}
                >
                  <animate 
                    attributeName="stroke-dashoffset" 
                    values="18;0" 
                    dur="1.5s" 
                    repeatCount="indefinite" 
                  />
                </path>

                {/* Threat Target Node Pulsing Ring */}
                <circle cx={sx} cy={sy} r="18" fill="none" stroke={site.color} strokeWidth="1.5" strokeDasharray="3 3">
                  <animate attributeName="r" values="12;26;12" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Core Impact Pin */}
                <g 
                  transform={`translate(${sx}, ${sy})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredImpact(site.id)}
                  onMouseLeave={() => setHoveredImpact(null)}
                  onClick={() => setActiveConsequence(site)}
                >
                  <circle cx="0" cy="0" r="10" fill="#0f172a" stroke={site.color} strokeWidth="2" />
                  <circle cx="0" cy="0" r="5" fill={site.color} />
                  
                  {/* Floating Consequence Tag */}
                  <g transform="translate(14, -14)">
                    <rect 
                      width="155" 
                      height="38" 
                      rx="6" 
                      fill="#091326" 
                      stroke={site.color} 
                      strokeWidth="1.5" 
                      className="shadow-xl"
                    />
                    <text x="8" y="15" fill="#ffffff" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                      {site.name.slice(0, 22)}
                    </text>
                    <text x="8" y="28" fill={site.color} fontSize="9" fontFamily="monospace" fontWeight="bold">
                      ETA: T+{site.etaHours}H · {site.severity}
                    </text>
                  </g>
                </g>

              </g>
            );
          })}

          {/* ============================================================ */}
          {/* HIGHLY DETAILED VISUAL SHIP MODEL (MV SOLARA TANKER)          */}
          {/* ============================================================ */}
          <g 
            transform={`translate(${shipX}, ${shipY}) rotate(${shipState.heading})`}
            className="visual-tanker-ship cursor-pointer"
            onClick={() => onSelectVessel('solara')}
          >
            {/* Stern Wake Turbulence Foaming in Water */}
            <path
              d="M -6,22 Q -15,48 -22,65 M 6,22 Q 15,48 22,65"
              fill="none"
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            >
              <animate attributeName="stroke-dashoffset" values="0;14" dur="0.8s" repeatCount="indefinite" />
            </path>
            
            {/* Propeller Wash Bubble Cone */}
            <polygon 
              points="-8,24 8,24 16,55 -16,55" 
              fill="rgba(56, 189, 248, 0.15)" 
            />

            {/* Pulsing Red Hazard Aura around Vessel */}
            <circle cx="0" cy="0" r="32" fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2">
              <animate attributeName="r" values="26;38;26" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Active Hydrocarbon Leak Plume Emitter */}
            {shipState.leaking && (
              <g className="leak-plume-emitter">
                <circle cx="-5" cy="8" r="6" fill="#1e1b4b" opacity="0.9">
                  <animate attributeName="r" values="3;12;3" dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.2s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* HULL GEOMETRY (Crude Oil Tanker 249m Top-Down Projection) */}
            {/* Red Underbody / Bilge Border */}
            <path
              d="M 0,-30 C 8,-24 12,-10 12,18 C 12,25 8,28 0,29 C -8,28 -12,25 -12,18 C -12,-10 -8,-24 0,-30 Z"
              fill="#7f1d1d"
              stroke="#ef4444"
              strokeWidth="1.5"
            />

            {/* Main Weather Deck (Gunmetal Gray) */}
            <path
              d="M 0,-28 C 7,-22 10,-8 10,16 C 10,22 7,25 0,26 C -7,25 -10,22 -10,16 C -10,-8 -7,-22 0,-28 Z"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1"
            />

            {/* Cargo Tank Deck Pipelines & Manifold System */}
            <line x1="0" y1="-18" x2="0" y2="8" stroke="#475569" strokeWidth="2" />
            <circle cx="-4" cy="-12" r="2.5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
            <circle cx="4" cy="-12" r="2.5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
            <circle cx="-4" cy="-2" r="2.5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
            <circle cx="4" cy="-2" r="2.5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
            <circle cx="-4" cy="6" r="2.5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />
            <circle cx="4" cy="6" r="2.5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="0.8" />

            {/* Deck Cargo Crane Cross-arms */}
            <line x1="-7" y1="-6" x2="7" y2="-6" stroke="#94a3b8" strokeWidth="1" />

            {/* Accommodation Deckhouse & Navigation Bridge (White / Light Slate) */}
            <rect x="-8" y="11" width="16" height="10" rx="2" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
            
            {/* Bridge Wing Windows */}
            <rect x="-6" y="13" width="12" height="2" fill="#0284c7" />

            {/* Funnel / Exhaust Smokestack */}
            <circle cx="0" cy="18" r="2.5" fill="#0f172a" stroke="#ef4444" strokeWidth="1" />

            {/* Navigation Bow Mast & Running Lights */}
            <circle cx="0" cy="-26" r="1.5" fill="#38bdf8" />
            <circle cx="-9" cy="12" r="1.2" fill="#ef4444" /> {/* Port Red Light */}
            <circle cx="9" cy="12" r="1.2" fill="#10b981" />  {/* Starboard Green Light */}

            {/* Rotating Radar Scanner Antenna */}
            <line x1="-3" y1="15" x2="3" y2="15" stroke="#38bdf8" strokeWidth="1.2">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 15"
                to="360 0 15"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </line>
          </g>

          {/* Visual Ship Identification & Future Consequence Callout Badge */}
          <g 
            transform={`translate(${shipX + 24}, ${shipY - 28})`} 
            className="cursor-pointer" 
            onClick={() => {
              if (onSelectVessel) onSelectVessel('solara');
              if (openEntityModal) {
                const v = CANDIDATE_VESSELS.find(item => item.id === 'solara');
                openEntityModal('VESSEL', v);
              }
            }}
            title="Click to inspect MV Solara AIS forensics"
          >
            <rect 
              width="180" 
              height="50" 
              rx="8" 
              fill="#091326" 
              stroke="#ef4444" 
              strokeWidth="1.5" 
              filter="url(#hazardGlow)"
            />
            <text x="10" y="17" fill="#ffffff" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
              MV Solara (Panama 🇵🇦)
            </text>
            <text x="10" y="30" fill="#fca5a5" fontSize="9" fontFamily="monospace">
              Crude Tanker · MMSI 257842190
            </text>
            <text x="10" y="42" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              CORRELATION: 91/100 · 17.4 KT
            </text>
          </g>

          {/* Compass Rose */}
          <g transform="translate(760, 450)" className="opacity-80">
            <circle cx="0" cy="0" r="22" fill="#07152b" stroke="#06b6d4" strokeWidth="1" />
            <line x1="0" y1="-20" x2="0" y2="20" stroke="#06b6d4" strokeWidth="1" />
            <line x1="-20" y1="0" x2="20" y2="0" stroke="#06b6d4" strokeWidth="1" />
            <text x="-4" y="-10" fill="#06b6d4" fontSize="9" fontFamily="monospace" fontWeight="bold">N</text>
          </g>

        </svg>

        {/* Dynamic Modal / Hologram on Map for Selected Consequence Site */}
        {activeConsequence && (
          <div className="absolute top-14 right-4 z-40 bg-[#091326]/95 backdrop-blur-md p-4 rounded-2xl border border-rose-500/80 max-w-sm shadow-2xl text-xs space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="font-bold text-white text-xs">{activeConsequence.name}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveConsequence(null)}
                className="text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-sky-300 font-medium">{activeConsequence.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Impact Horizon:</span>
                <span className="font-mono text-rose-400 font-bold">ETA: T+{activeConsequence.etaHours} Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Loss Metric:</span>
                <span className="font-mono text-amber-300">{activeConsequence.lossEstimate}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 leading-snug">
              {activeConsequence.description}
            </p>

            <div className="p-2.5 bg-sky-950/40 rounded-xl border border-sky-800/40 text-[11px] text-sky-200">
              <strong>Emergency Defense:</strong> {activeConsequence.response}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Map Telemetry & Ship Impact Summary Bar */}
      <div className="bg-[#091122] border-t border-slate-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Visual Ship Telemetry Callout */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-800 text-rose-400 border border-slate-700">
            <Ship className="w-4 h-4" />
          </div>
          <div>
            <span className="text-white font-bold block">
              MV Solara · Potential Source Vessel
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Speed: {shipState.speed} kts · Trajectory Heading: {shipState.heading}° NE · Status: {shipState.leaking ? "⚠️ Active Plume" : "Underway"}
            </span>
          </div>
        </div>

        {/* 4 Impact Quick Buttons */}
        <div className="flex items-center gap-2">
          {IMPACT_SITES.map((site) => (
            <button
              key={site.id}
              type="button"
              onClick={() => setActiveConsequence(site)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeConsequence?.id === site.id
                  ? "bg-rose-950/80 text-rose-200 border-rose-500 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: site.color }} />
              <span>{site.name.split(' ')[0]}</span>
              <span className="font-mono text-[10px] text-slate-400">T+{site.etaHours}h</span>
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
