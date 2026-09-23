import React, { useState } from 'react';
import { 
  Target, 
  Sliders, 
  AlertTriangle, 
  Clock, 
  Gauge, 
  MapPin 
} from 'lucide-react';
import { VESSELS } from '../../data/mockData';

export default function AnalysisView() {
  const [selectedVesselId, setSelectedVesselId] = useState("solara");

  const selectedVessel = VESSELS.find(v => v.id === selectedVesselId) || VESSELS[0];

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <Target className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
            Attribution Engine & Spatio-Temporal Correlation
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Vessel Attribution Analysis
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Correlating vessel trajectories, transponder blackout gaps, and hydrodynamic back-drift simulation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: VESSEL RANKING LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Attribution Ranking Candidates
            </span>
            <span className="text-xs text-sky-400 font-medium">Sorted by Score</span>
          </div>

          <div className="space-y-3">
            {VESSELS.filter(v => v.id !== 'coastguard').map((vessel) => {
              const isSelected = selectedVesselId === vessel.id;
              
              return (
                <div
                  key={vessel.id}
                  onClick={() => setSelectedVesselId(vessel.id)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-[#13233e] border-sky-500/80 shadow-sm ring-1 ring-sky-500/30"
                      : "bg-[#0f172a] border-slate-800 hover:border-slate-700 hover:bg-[#111c33]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-xl font-medium text-xs flex items-center justify-center ${
                        vessel.rank === 1 ? "bg-rose-600 text-white font-bold" : "bg-slate-800 text-slate-300"
                      }`}>
                        #{vessel.rank}
                      </span>
                      <div>
                        <h4 className="font-semibold text-sm text-white flex items-center gap-1.5">
                          {vessel.name}
                          {vessel.rank === 1 && <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {vessel.type} · MMSI: <span className="text-sky-300 font-mono">{vessel.mmsi}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className={`text-xl font-bold ${
                          vessel.attributionScore >= 80 ? 'text-rose-400' :
                          vessel.attributionScore >= 30 ? 'text-amber-300' :
                          'text-emerald-400'
                        }`}>
                          {vessel.attributionScore}
                        </span>
                        <span className="text-xs text-slate-400">/100</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">
                        {vessel.confidenceCategory} Conf.
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Score Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        vessel.attributionScore >= 80 ? 'bg-rose-500' :
                        vessel.attributionScore >= 30 ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${vessel.attributionScore}%` }}
                    />
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED ANALYSIS PANEL (7 cols) */}
        <div className="lg:col-span-7">
          
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-sm space-y-6">
            
            {/* Selected Vessel Overview Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">
                  Evidence Analysis Dossier
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5 flex items-center gap-2">
                  {selectedVessel.name}
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-normal">
                    {selectedVessel.type}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  MMSI: <span className="text-sky-300 font-mono">{selectedVessel.mmsi}</span> · Flag: <span className="text-slate-200">{selectedVessel.flag}</span>
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-400 uppercase font-medium block">Match Score</span>
                <span className={`text-3xl font-black ${
                  selectedVessel.attributionScore >= 80 ? 'text-rose-400' :
                  selectedVessel.attributionScore >= 30 ? 'text-amber-300' :
                  'text-emerald-400'
                }`}>
                  {selectedVessel.attributionScore}
                  <span className="text-xs text-slate-400 font-normal">/100</span>
                </span>
              </div>
            </div>

            {/* Narrative Box */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>AIS Anomaly Observation:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedVessel.aisGapDetails}
              </p>
              <p className="text-xs text-amber-300/90 leading-relaxed">
                {selectedVessel.anomalySummary}
              </p>
            </div>

            {/* Sub-Score Breakdown */}
            <div className="space-y-4 pt-1">
              <h4 className="text-xs text-sky-400 uppercase font-semibold tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                Weighted Component Breakdown
              </h4>

              {/* Bar 1: Proximity */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-200 font-medium flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    Proximity to Spill Origin:
                  </span>
                  <span className="text-sky-300 font-bold text-sm">
                    {selectedVessel.scores.proximity} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-sky-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${selectedVessel.scores.proximity}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Calculates geometric distance between vessel trajectory and back-drifted spill origin point.
                </p>
              </div>

              {/* Bar 2: AIS Gap */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-200 font-medium flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    AIS Transponder Gap Duration:
                  </span>
                  <span className="text-rose-400 font-bold text-sm">
                    {selectedVessel.scores.aisGap} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${selectedVessel.scores.aisGap}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Measures duration of intentional or accidental AIS silence during the estimated discharge interval.
                </p>
              </div>

              {/* Bar 3: Speed Anomaly */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-200 font-medium flex items-center gap-2">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    Post-Gap Speed & Acceleration Anomaly:
                  </span>
                  <span className="text-amber-400 font-bold text-sm">
                    {selectedVessel.scores.speedAnomaly} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${selectedVessel.scores.speedAnomaly}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Detects anomalous post-event acceleration (+6.2 kt delta on MV Solara) compared to normal cruising profile.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
