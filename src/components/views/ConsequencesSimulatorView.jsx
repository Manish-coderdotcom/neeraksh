import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  Wind, 
  Waves, 
  AlertOctagon, 
  ShieldAlert, 
  DollarSign, 
  Fish, 
  Trees, 
  Anchor, 
  Flame, 
  Sliders,
  CheckCircle2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { INCIDENT_PROFILE, PREDICTION_TIMELINE, ECOSYSTEM_ZONES } from '../../data/simulationData';
import OceanGlobe3D from '../globe/OceanGlobe3D';

const WEATHER_SCENARIOS = [
  { id: 'calm', name: 'Calm Sea (State 2)', wind: 8, current: 0.8, wave: 0.6, desc: 'Slower spread, higher mechanical recovery window' },
  { id: 'moderate', name: 'Current Conditions (State 3)', wind: 14.2, current: 1.25, wave: 1.2, desc: 'Active wind shear, rapid emulsion onset' },
  { id: 'storm', name: 'Gale Warning (State 5-6)', wind: 32, current: 2.4, wave: 3.5, desc: 'Severe offshore dispersion, boom failure risk' },
  { id: 'subarctic', name: 'Cold Winter Waters (4°C)', wind: 18, current: 1.5, wave: 1.8, desc: 'Near-zero evaporation, extreme persistence' },
];

export default function ConsequencesSimulatorView() {
  const [sliderIndex, setSliderIndex] = useState(3); // 24H default
  const [activeWeather, setActiveWeather] = useState('moderate');
  const [oilVolumeBbl, setOilVolumeBbl] = useState(550);
  const [oilType, setOilType] = useState('Heavy Crude');

  const currentForecast = PREDICTION_TIMELINE[sliderIndex] || PREDICTION_TIMELINE[0];
  const weatherObj = WEATHER_SCENARIOS.find(w => w.id === activeWeather) || WEATHER_SCENARIOS[1];

  // Weather scenario multiplier
  const weatherMultiplier = activeWeather === 'storm' ? 1.6 : (activeWeather === 'calm' ? 0.75 : 1.0);
  const volMultiplier = oilVolumeBbl / 550;

  // Calculated Consequences Metrics
  const calculatedSlickArea = (currentForecast.slickAreaKm2 * weatherMultiplier * Math.sqrt(volMultiplier)).toFixed(1);
  const threatenedShorelineKm = (currentForecast.hours === 0 ? 0 : Math.min(85, (currentForecast.hours * 1.15 * weatherMultiplier))).toFixed(1);
  const habitatExposureHectares = (currentForecast.hours === 0 ? 420 : Math.min(12400, (850 + currentForecast.hours * 145 * weatherMultiplier))).toFixed(0);
  const fisheriesAffectedCount = currentForecast.hours >= 24 ? 3 : (currentForecast.hours >= 12 ? 2 : 1);
  const cleanupDifficultyIndex = Math.min(98, Math.round(35 + currentForecast.hours * 0.75 * (activeWeather === 'storm' ? 1.4 : 1.0)));
  const economicExposureMillion = (volMultiplier * (4.2 + (currentForecast.hours * 0.28) * (activeWeather === 'storm' ? 1.3 : 1.0))).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
              Scenario Analysis & Consequence Modeling
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Future Consequences Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Simulate hydrodynamic spread, coastal impact risk, ecosystem damage, and cleanup difficulty under variable weather regimes.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-medium flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Simulation Horizon: {currentForecast.label}</span>
        </div>
      </div>

      {/* Main Interactive Timeline Scrubber Slider */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Simulation Timeline Horizon
            </span>
          </div>
          <span className="text-xs font-mono text-sky-300 font-semibold bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
            {currentForecast.label} · {currentForecast.timeUTC}
          </span>
        </div>

        {/* Step Slider */}
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={sliderIndex}
            onChange={(e) => setSliderIndex(parseInt(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />

          {/* Slider Labels */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400 px-1">
            {PREDICTION_TIMELINE.map((step, idx) => (
              <button
                key={step.horizonKey}
                type="button"
                onClick={() => setSliderIndex(idx)}
                className={`transition-colors cursor-pointer ${
                  sliderIndex === idx ? 'text-sky-300 font-bold' : 'hover:text-slate-200'
                }`}
              >
                {step.horizonKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: 3D Visualization + Consequence Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 3D Globe Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#070f1e] overflow-hidden shadow-md">
            <div className="p-3 bg-[#0a1426] border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-sky-400" />
                Dynamic Spreading Simulation ({currentForecast.label})
              </span>
              <span className="text-[11px] font-mono text-sky-400">
                Shoreline Dist: {currentForecast.coastalDistanceNM} NM
              </span>
            </div>

            <OceanGlobe3D
              currentHorizon={currentForecast.horizonKey}
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

          {/* Weather Scenario Preset Selector */}
          <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 block">
              Weather Scenario Driver:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {WEATHER_SCENARIOS.map((ws) => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => setActiveWeather(ws.id)}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    activeWeather === ws.id
                      ? "bg-sky-500/15 border-sky-400 text-white shadow-sm ring-1 ring-sky-500/30"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className={activeWeather === ws.id ? "text-sky-300" : "text-slate-200"}>{ws.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{ws.wind} kts</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{ws.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Dynamic Consequence Impact Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Modeled Consequences Impact
              </h3>
              <span className="text-[10px] font-mono uppercase bg-slate-900 px-2 py-0.5 rounded text-slate-400">
                Horizon: {currentForecast.horizonKey}
              </span>
            </div>

            {/* Impact Metric Cards */}
            <div className="space-y-3 text-xs">
              
              {/* Slick Area Growth */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Slick Footprint Growth</span>
                  <span className="text-slate-200 font-medium">Sea Surface Area</span>
                </div>
                <div className="text-right">
                  <span className="text-rose-400 font-bold text-base block">{calculatedSlickArea} km²</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Baseline: 14.8 km²
                  </span>
                </div>
              </div>

              {/* Coastal Shoreline Threatened */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Shoreline Threat Exposure</span>
                  <span className="text-slate-200 font-medium">Vestland Coast / Skerries</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-bold text-base block">{threatenedShorelineKm} km</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {currentForecast.coastalDistanceNM} NM to Land
                  </span>
                </div>
              </div>

              {/* Sensitive Habitat Exposure */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Benthic & Pelagic Habitats</span>
                  <span className="text-slate-200 font-medium">Corals & Coastal Reserves</span>
                </div>
                <div className="text-right">
                  <span className="text-purple-400 font-bold text-base block">{habitatExposureHectares} ha</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Lophelia Bioherm #4
                  </span>
                </div>
              </div>

              {/* Commercial Fisheries Affected */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Commercial Fisheries Exclusion</span>
                  <span className="text-slate-200 font-medium">Herring & Cod Grounds</span>
                </div>
                <div className="text-right">
                  <span className="text-sky-400 font-bold text-base block">{fisheriesAffectedCount} Active Zones</span>
                  <span className="text-[10px] text-slate-400 font-mono">Sector 4B Catch Ban</span>
                </div>
              </div>

              {/* Cleanup Difficulty Index */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Estimated Cleanup Difficulty:</span>
                  <span className="text-rose-400 font-bold">{cleanupDifficultyIndex}/100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      cleanupDifficultyIndex > 75 ? "bg-rose-500" : (cleanupDifficultyIndex > 50 ? "bg-amber-500" : "bg-sky-500")
                    }`} 
                    style={{ width: `${cleanupDifficultyIndex}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Factors: Viscosity emulsification, sea state {weatherObj.wave}m, distance from Florø logistics base.
                </span>
              </div>

              {/* Potential Economic Exposure */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Estimated Economic Exposure</span>
                  <span className="text-slate-200 font-medium">Cleanup Cost + Fishery Loss</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold text-lg block">${economicExposureMillion}M</span>
                  <span className="text-[10px] text-slate-400 font-mono">Simulated Estimate</span>
                </div>
              </div>

            </div>
          </div>

          {/* Oil Discharge Volume Adjuster */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-4 shadow-sm text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium">Scenario Oil Discharge Volume:</span>
              <span className="font-mono text-sky-400 font-bold">{oilVolumeBbl} Barrels</span>
            </div>
            <input
              type="range"
              min="100"
              max="2500"
              step="50"
              value={oilVolumeBbl}
              onChange={(e) => setOilVolumeBbl(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
