import React, { useState } from 'react';
import { 
  Globe, 
  Layers, 
  Eye, 
  EyeOff, 
  Wind, 
  Waves, 
  Ship, 
  Fish, 
  ShieldAlert, 
  Radio, 
  Anchor, 
  Compass, 
  Activity, 
  Maximize2 
} from 'lucide-react';
import { INCIDENT_PROFILE, GEOSPATIAL_ANCHORS, ECOSYSTEM_ZONES } from '../../data/simulationData';
import OceanGlobe3D from '../globe/OceanGlobe3D';

export default function DigitalTwinView() {
  const [layers, setLayers] = useState({
    spill: true,
    trajectory: true,
    riskZones: true,
    vessels: true,
    ecosystem: true,
    emergency: true,
    shippingLanes: true,
    graticule: true,
  });

  const [activeDepth, setActiveDepth] = useState(-285);

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const layerDefinitions = [
    { key: 'spill', label: 'Active Oil Slick', icon: ShieldAlert, color: 'text-rose-400', count: '14.8 km²' },
    { key: 'trajectory', label: 'Hydrodynamic Drift (72h)', icon: Compass, color: 'text-sky-400', count: '6 Waypoints' },
    { key: 'riskZones', label: 'Dynamic Risk Zones', icon: Activity, color: 'text-amber-400', count: '4 Envelopes' },
    { key: 'vessels', label: 'AIS Marine Traffic', icon: Ship, color: 'text-emerald-400', count: '6 Ships' },
    { key: 'ecosystem', label: 'Marine Ecosystems & Corals', icon: Fish, color: 'text-purple-400', count: '5 Habitats' },
    { key: 'emergency', label: 'Emergency Response Fleet', icon: Radio, color: 'text-blue-400', count: '5 Assets' },
    { key: 'shippingLanes', label: 'Commercial Shipping Fairways', icon: Anchor, color: 'text-slate-400', count: '3 Lanes' },
    { key: 'graticule', label: 'Nautical Graticule Grid', icon: Globe, color: 'text-cyan-400', count: '20° WGS84' },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
              Hydrographic Digital Twin Architecture
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Digital Twin of Affected Ocean Area
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time geospatial twin fusing satellite radar, hydrodynamic vector fields, bathymetric contours, and marine telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
          <span className="text-emerald-400 font-bold">18 SENSORS ONLINE</span>
          <span className="text-slate-600">|</span>
          <span>SYNC: LIVE (1 Hz)</span>
        </div>
      </div>

      {/* Main Grid: 3D Globe Digital Twin Centerpiece + Layer Controller Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive 3D Digital Twin Viewport (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#070f1e] overflow-hidden shadow-lg relative">
            <div className="p-3 bg-[#0a1426] border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Sector 4B Hydrographic Twin Engine
              </span>
              <span className="text-[11px] font-mono text-cyan-300">
                Bathymetry: 0 to -400m
              </span>
            </div>

            <OceanGlobe3D
              currentHorizon="12H"
              layerVisibility={layers}
            />
          </div>

          {/* Bathymetric Depth Profile Cross-Section */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Waves className="w-4 h-4 text-sky-400" />
                Ocean Bathymetry & Water Column Cross-Section
              </span>
              <span className="font-mono text-sky-300">Current Depth: {activeDepth}m</span>
            </div>

            {/* Simulated Depth Bar */}
            <div className="relative h-12 bg-gradient-to-b from-[#0ea5e9]/20 via-[#0369a1]/40 to-[#022c22]/60 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-between px-4 text-[11px] font-mono text-slate-300">
              <span className="z-10">Surface (0m) — Slick Core</span>
              <span className="z-10">Thermocline (-85m)</span>
              <span className="z-10">Benthic Bioherms (-220m)</span>
              <span className="z-10">Sea Floor (-285m)</span>
              
              <div 
                className="absolute inset-x-0 h-[2px] bg-cyan-400/80 shadow-[0_0_8px_#38bdf8]" 
                style={{ top: '65%' }}
              />
            </div>
          </div>
        </div>

        {/* Right: Layer Switching Matrix & Environmental Telemetry (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Layer Switcher Card */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Digital Twin Layer Stack
              </h3>
              <span className="text-[10px] text-slate-400">Click to Toggle</span>
            </div>

            <div className="space-y-1.5">
              {layerDefinitions.map((layer) => {
                const Icon = layer.icon;
                const isEnabled = layers[layer.key];

                return (
                  <button
                    key={layer.key}
                    type="button"
                    onClick={() => toggleLayer(layer.key)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${
                      isEnabled
                        ? "bg-slate-900 border-slate-700/80 text-white shadow-xs"
                        : "bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isEnabled ? "bg-slate-800" : "bg-slate-900"}`}>
                        <Icon className={`w-3.5 h-3.5 ${isEnabled ? layer.color : "text-slate-600"}`} />
                      </div>
                      <span className="font-medium text-left">{layer.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">{layer.count}</span>
                      {isEnabled ? (
                        <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Environmental Sensor Feeds */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-800">
              Coupled Hydro-Meteorological Sensors
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  NOAA Surface Wind:
                </span>
                <span className="font-mono text-white font-medium">215° SW @ 14.2 kts</span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  Copernicus Current:
                </span>
                <span className="font-mono text-white font-medium">045° NE @ 1.25 kts</span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400">Sea Temperature:</span>
                <span className="font-mono text-slate-200">11.4 °C (North Sea SST)</span>
              </div>

              <div className="flex justify-between items-center p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-slate-400">Salinity Density:</span>
                <span className="font-mono text-slate-200">34.8 PSU (1027 kg/m³)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
