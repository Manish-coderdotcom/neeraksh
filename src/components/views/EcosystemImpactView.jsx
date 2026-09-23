import React, { useState } from 'react';
import { 
  Fish, 
  Trees, 
  Shield, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Compass, 
  Anchor, 
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Activity
} from 'lucide-react';
import { ECOSYSTEM_ZONES, INCIDENT_PROFILE } from '../../data/simulationData';
import OceanGlobe3D from '../globe/OceanGlobe3D';

export default function EcosystemImpactView() {
  const [selectedEcoId, setSelectedEcoId] = useState(ECOSYSTEM_ZONES[0].id);

  const selectedEco = ECOSYSTEM_ZONES.find(e => e.id === selectedEcoId) || ECOSYSTEM_ZONES[0];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">
              Ecological Vulnerability Assessment
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Marine Ecosystem Impact Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Spatial intersection of hydrodynamic drift vectors with cold-water coral reefs, pelagic fish spawning grounds, and coastal nature reserves.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>OVERALL SEVERITY: CRITICAL</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Ecosystem Master List + 3D Map + Detailed Habitat Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Vulnerable Ecosystem Habitats List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Identified Ecological Hotspots
            </span>
            <span className="text-xs text-sky-400 font-medium">Sorted by ETA</span>
          </div>

          <div className="space-y-3">
            {ECOSYSTEM_ZONES.map((eco) => {
              const isSelected = selectedEcoId === eco.id;

              return (
                <div
                  key={eco.id}
                  onClick={() => setSelectedEcoId(eco.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#13233e] border-sky-500/80 shadow-md ring-1 ring-sky-500/30"
                      : "bg-[#0f172a] border-slate-800 hover:border-slate-700 hover:bg-[#111c33]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Fish className="w-4 h-4 text-sky-400" />
                      {eco.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                      eco.vulnerabilityLevel === 'CRITICAL'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                        : eco.vulnerabilityLevel === 'HIGH'
                        ? 'bg-orange-950/80 text-orange-300 border border-orange-800/60'
                        : eco.vulnerabilityLevel === 'MODERATE'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    }`}>
                      {eco.vulnerabilityLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-2.5">{eco.category}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/60 text-slate-300">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Distance from Spill:</span>
                      <span className="font-mono text-sky-300 font-medium">{eco.distanceFromSpillNM} NM</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Potential Exposure ETA:</span>
                      <span className={`font-mono font-medium ${
                        eco.timeToPotentialExposureHours <= 24 ? "text-rose-400" : "text-amber-300"
                      }`}>
                        {eco.timeToPotentialExposureHours > 200 ? "Updrift (Protected)" : `T+${eco.timeToPotentialExposureHours} Hours`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 3D Heatmap Map & Habitat Detailed Profile (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 3D Ecosystem Heatmap Viewport */}
          <div className="rounded-2xl border border-slate-800 bg-[#070f1e] overflow-hidden shadow-md">
            <div className="p-3 bg-[#0a1426] border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-400" />
                3D Habitat Proximity & Heatmap Halo
              </span>
              <span className="text-[11px] font-mono text-rose-400">
                Focused: {selectedEco.name}
              </span>
            </div>

            <OceanGlobe3D
              currentHorizon="24H"
              layerVisibility={{
                spill: true,
                trajectory: true,
                riskZones: false,
                vessels: false,
                ecosystem: true,
                emergency: false,
                shippingLanes: false,
                graticule: true,
              }}
            />
          </div>

          {/* Selected Habitat Deep-Dive Inspector Card */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase text-sky-400 block">
                  Habitat Environmental Profile
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedEco.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400 block">Depth / Footprint</span>
                <span className="text-xs font-mono text-slate-200">
                  {selectedEco.depthMeters}m depth · {selectedEco.areaHectares} ha
                </span>
              </div>
            </div>

            {/* Key Vulnerable Species Chips */}
            <div>
              <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                Key Species & Biodiversity at Risk:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEco.keySpecies.map((sp, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-sky-300 font-medium"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>

            {/* Impact Mechanism */}
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-rose-400 block">
                Modeled Ecological Impact Mechanism:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedEco.potentialImpact}
              </p>
            </div>

            {/* Tactical Environmental Protection Directive */}
            <div className="p-3 bg-sky-950/30 rounded-xl border border-sky-800/40 space-y-1">
              <span className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-sky-400" />
                Recommended Environmental Defense Directive:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedEco.recommendedResponse}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Scientific Scenario Disclaimer */}
      <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Decision-Support Notice:</strong> Ecosystem impact levels are scenario simulations derived from Copernicus marine spatial planning databases and hydrodynamic drift trajectories. Field verification by marine biology teams is required before chemical dispersant authorizations.
        </span>
      </div>
    </div>
  );
}
