import React, { useState } from 'react';
import { 
  Radio, 
  Target, 
  AlertTriangle, 
  Clock, 
  Compass, 
  Anchor, 
  CheckCircle2, 
  AlertOctagon, 
  Sliders, 
  ShieldAlert,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { CANDIDATE_VESSELS, INCIDENT_PROFILE } from '../../data/simulationData';
import OceanGlobe3D from '../globe/OceanGlobe3D';

export default function VesselSourceView() {
  const [selectedVesselId, setSelectedVesselId] = useState("solara");

  const selectedVessel = CANDIDATE_VESSELS.find(v => v.id === selectedVesselId) || CANDIDATE_VESSELS[0];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">
              Forensic AIS Telemetry & Spatio-Temporal Match
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Vessel Source Identification & Forensic Attribution
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Bayesian correlation of historical AIS vessel tracks, transponder blackout intervals, radar backscatter wake vectors, and hydrodynamic back-drift modeling.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-sky-400" />
          <span>42 VESSELS SCREENED</span>
        </div>
      </div>

      {/* Main Grid: Candidate Vessels Ranked List + 3D Trajectory Globe + Forensic Evidence Pack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Candidate Vessels Ranked List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Potential Source Vessels (Ranked)
            </span>
            <span className="text-xs text-sky-400 font-medium">Correlation Score</span>
          </div>

          <div className="space-y-3">
            {CANDIDATE_VESSELS.filter(v => v.id !== 'coastguard').map((vessel) => {
              const isSelected = selectedVesselId === vessel.id;

              return (
                <div
                  key={vessel.id}
                  onClick={() => setSelectedVesselId(vessel.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#13233e] border-sky-500/80 shadow-md ring-1 ring-sky-500/30"
                      : "bg-[#0f172a] border-slate-800 hover:border-slate-700 hover:bg-[#111c33]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{vessel.name}</span>
                      <span className="text-[11px] text-slate-400">{vessel.flag}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-rose-400">
                        {vessel.correlationScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>{vessel.type}</span>
                    <span className="font-mono text-[11px]">MMSI: {vessel.mmsi}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-800/60 text-slate-300">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Distance:</span>
                      <span className="font-mono text-white">{vessel.distanceFromSpillNM} NM</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Speed:</span>
                      <span className="font-mono text-white">{vessel.currentSpeedKnots} kt</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Trajectory Match:</span>
                      <span className="font-mono text-emerald-400">{vessel.trajectoryMatchPercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 3D Trajectory Globe & Selected Vessel Forensic Evidence (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 3D Vessel Track Map */}
          <div className="rounded-2xl border border-slate-800 bg-[#070f1e] overflow-hidden shadow-md">
            <div className="p-3 bg-[#0a1426] border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-400" />
                Spatio-Temporal Intercept Track
              </span>
              <span className="text-[11px] font-mono text-sky-400">
                Inspecting: {selectedVessel.name}
              </span>
            </div>

            <OceanGlobe3D
              currentHorizon="0H"
              layerVisibility={{
                spill: true,
                trajectory: true,
                riskZones: false,
                vessels: true,
                ecosystem: false,
                emergency: true,
                shippingLanes: true,
                graticule: true,
              }}
            />
          </div>

          {/* Selected Candidate Detailed Forensic Evidence Card */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 block mb-0.5">
                  {selectedVessel.role}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {selectedVessel.name} · IMO {selectedVessel.imo}
                </h3>
              </div>

              <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-right">
                <span className="text-[10px] text-slate-400 block">Overall Correlation</span>
                <span className="text-xl font-black text-rose-400 font-mono">
                  {selectedVessel.correlationScore} / 100
                </span>
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Proximity:</span>
                  <span className="text-white font-mono">{selectedVessel.scores.proximity}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-400 h-full" style={{ width: `${selectedVessel.scores.proximity}%` }} />
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">AIS Gap Penalty:</span>
                  <span className="text-rose-400 font-mono">{selectedVessel.scores.aisGap}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: `${selectedVessel.scores.aisGap}%` }} />
                </div>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Speed Anomaly:</span>
                  <span className="text-amber-300 font-mono">{selectedVessel.scores.speedAnomaly}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${selectedVessel.scores.speedAnomaly}%` }} />
                </div>
              </div>
            </div>

            {/* Forensic Anomaly Summaries */}
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-0.5">Transponder Telemetry Analysis:</span>
                <p className="text-slate-400 leading-relaxed font-sans">{selectedVessel.aisGapSummary}</p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-0.5">Speed & Heading Anomaly:</span>
                <p className="text-slate-400 leading-relaxed font-sans">{selectedVessel.speedAnomalySummary}</p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-0.5">SAR Satellite Radar Verification:</span>
                <p className="text-slate-400 leading-relaxed font-sans">{selectedVessel.sarCrossCheck}</p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Strict Neutral Judicial Notice */}
      <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Legal Standard Notice:</strong> All vessel correlation scores represent probabilistic algorithmic matches between transponder timelines, SAR wakes, and hydrodynamic back-drift vectors. In accordance with maritime intelligence standards, vessels are designated strictly as <em>"Potential Source Vessels"</em> until formal inspection and fuel sampling by maritime authorities.
        </span>
      </div>
    </div>
  );
}
