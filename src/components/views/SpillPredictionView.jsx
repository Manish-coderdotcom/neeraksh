import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wind, 
  Waves, 
  Thermometer, 
  Compass, 
  Clock, 
  AlertTriangle, 
  Activity, 
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { INCIDENT_PROFILE, PREDICTION_TIMELINE } from '../../data/simulationData';
import OceanGlobe3D from '../globe/OceanGlobe3D';

export default function SpillPredictionView() {
  const [forecastHorizon, setForecastHorizon] = useState("24H");
  const [windSpeed, setWindSpeed] = useState(14.2);
  const [windHeading, setWindHeading] = useState(215);
  const [currentSpeed, setCurrentSpeed] = useState(1.25);
  const [currentHeading, setCurrentHeading] = useState(45);
  const [waveHeight, setWaveHeight] = useState(1.2);
  const [oilType, setOilType] = useState("Heavy Crude");
  const [isSimulating, setIsSimulating] = useState(false);

  const activeWaypoint = PREDICTION_TIMELINE.find(p => p.horizonKey === forecastHorizon) || PREDICTION_TIMELINE[3];

  const handleRunCustomSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
              Hydrodynamic Trajectory & Weathering Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            AI-Powered Oil Spill Prediction (0 – 72 Hours)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Coupled Eulerian-Lagrangian transport model integrating NOAA GFS surface wind shear, Copernicus marine currents, and Fay's viscous spreading formula.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunCustomSimulation}
            disabled={isSimulating}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? "Computing..." : "Re-Calculate Vectors"}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Globe + Prediction Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive 3D Trajectory Globe (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#070f1e] overflow-hidden shadow-md">
            <div className="p-3 bg-[#0a1426] border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-400" />
                3D Hydrodynamic Trajectory Flow
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Model: Neeraksh-Drift-2.4
              </span>
            </div>
            
            <OceanGlobe3D
              currentHorizon={forecastHorizon}
              layerVisibility={{
                spill: true,
                trajectory: true,
                riskZones: true,
                vessels: false,
                ecosystem: true,
                emergency: false,
                shippingLanes: false,
                graticule: true,
              }}
            />
          </div>

          {/* Time Horizon Selector Tabs */}
          <div className="bg-[#0f172a] p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-300 pl-2">
              Forecast Horizon:
            </span>
            <div className="flex items-center gap-1.5">
              {PREDICTION_TIMELINE.map((step) => {
                const isSelected = forecastHorizon === step.horizonKey;
                return (
                  <button
                    key={step.horizonKey}
                    type="button"
                    onClick={() => setForecastHorizon(step.horizonKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-500 text-slate-950 font-bold shadow-sm"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-750 hover:text-white"
                    }`}
                  >
                    {step.horizonKey}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Environmental Parameter Controls & Active Forecast Analytics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Horizon Telemetry Card */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 block">
                  Active Projection ({activeWaypoint.label})
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeWaypoint.coordinates.lat.toFixed(2)}°N, {activeWaypoint.coordinates.lng.toFixed(2)}°E
                </h3>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                activeWaypoint.hours >= 48 
                  ? "bg-rose-950/60 text-rose-300 border-rose-800/50" 
                  : (activeWaypoint.hours >= 24 ? "bg-amber-950/60 text-amber-300 border-amber-800/50" : "bg-sky-950/60 text-sky-300 border-sky-800/50")
              }`}>
                Confidence: {activeWaypoint.confidencePercent}%
              </span>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-0.5">Projected Slick Area</span>
                <span className="text-rose-400 font-bold text-base">{activeWaypoint.slickAreaKm2} km²</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">+{((activeWaypoint.slickAreaKm2 / 14.8 - 1) * 100).toFixed(0)}% expansion</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-0.5">Remaining Volume</span>
                <span className="text-amber-300 font-bold text-base">{activeWaypoint.volumeRemainingBbl} bbl</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{activeWaypoint.evaporatedPercent}% evaporated</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-0.5">Distance to Shoreline</span>
                <span className="text-white font-mono font-bold text-base">{activeWaypoint.coastalDistanceNM} NM</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Vestland Skerries</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-0.5">Landfall Probability</span>
                <span className={`font-bold text-base ${
                  activeWaypoint.landfallProbability > 50 ? "text-rose-400" : (activeWaypoint.landfallProbability > 10 ? "text-amber-300" : "text-emerald-400")
                }`}>
                  {activeWaypoint.landfallProbability}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Within {activeWaypoint.hours}h</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-sky-300 block mb-0.5">Phase Analysis:</span>
              {activeWaypoint.statusText}
            </div>
          </div>

          {/* Environmental Force Modifiers */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                Live Meteorological & Oceanic Drivers
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Sensors: Real-Time</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Wind Speed */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-sky-400" />
                    Wind Velocity (10m Surface):
                  </span>
                  <span className="font-mono text-white font-medium">{windSpeed} kts (Heading {windHeading}°)</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="0.5"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* Current Speed */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Waves className="w-3.5 h-3.5 text-cyan-400" />
                    Tidal Surface Current:
                  </span>
                  <span className="font-mono text-white font-medium">{currentSpeed} kts (Heading {currentHeading}°)</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="4.0"
                  step="0.1"
                  value={currentSpeed}
                  onChange={(e) => setCurrentSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Oil Type Selector */}
              <div>
                <span className="text-slate-300 block mb-1.5">Hydrocarbon Viscosity Profile:</span>
                <div className="grid grid-cols-2 gap-2">
                  {["Heavy Crude", "Medium Crude", "Light Crude", "Marine Gas Oil"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setOilType(type)}
                      className={`p-2 rounded-xl text-left text-[11px] font-medium transition-colors cursor-pointer border ${
                        oilType === type
                          ? "bg-sky-500/15 border-sky-400 text-sky-200"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Complete Multi-Horizon Forecast Matrix Table */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          Multi-Horizon Trajectory & Expansion Projection Matrix
        </h3>

        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
              <th className="pb-3 pr-4">HORIZON</th>
              <th className="pb-3 px-4">TIMESTAMP</th>
              <th className="pb-3 px-4">COORDINATES</th>
              <th className="pb-3 px-4">SLICK AREA</th>
              <th className="pb-3 px-4">THICKNESS</th>
              <th className="pb-3 px-4">SHORELINE DIST</th>
              <th className="pb-3 px-4">LANDFALL RISK</th>
              <th className="pb-3 pl-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {PREDICTION_TIMELINE.map((row) => (
              <tr 
                key={row.horizonKey} 
                onClick={() => setForecastHorizon(row.horizonKey)}
                className={`transition-colors cursor-pointer hover:bg-slate-800/40 ${
                  forecastHorizon === row.horizonKey ? "bg-sky-500/10 font-semibold text-sky-200" : "text-slate-300"
                }`}
              >
                <td className="py-3 pr-4 font-mono font-bold text-sky-400">{row.horizonKey}</td>
                <td className="py-3 px-4 font-mono text-slate-400">{row.timeUTC}</td>
                <td className="py-3 px-4 font-mono">{row.coordinates.lat}°N, {row.coordinates.lng}°E</td>
                <td className="py-3 px-4 text-rose-400 font-medium">{row.slickAreaKm2} km²</td>
                <td className="py-3 px-4 text-slate-300">{row.thicknessMicrons} µm</td>
                <td className="py-3 px-4 text-white font-mono">{row.coastalDistanceNM} NM</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    row.landfallProbability > 50 ? "bg-rose-950/80 text-rose-300" : (row.landfallProbability > 10 ? "bg-amber-950/80 text-amber-300" : "bg-emerald-950/80 text-emerald-300")
                  }`}>
                    {row.landfallProbability}%
                  </span>
                </td>
                <td className="py-3 pl-4 text-slate-400 text-[11px] truncate max-w-xs">{row.statusText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scientific Disclaimer */}
      <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Decision-Support Notice:</strong> Predictions are generated via hydrodynamic vector superposition and empirical weathering curves. Actual slick movements depend on micro-scale bathymetric eddies and local shoreline topography.
        </span>
      </div>
    </div>
  );
}
