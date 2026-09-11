import React, { useState } from 'react';
import { 
  BarChart3, 
  Target, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Zap, 
  Info,
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
      <div className="bg-gradient-to-r from-[#071328] via-[#0a1b38] to-[#071328] p-5 rounded-xl border border-cyan-900/40 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
            BAYESIAN ATTRIBUTION ENGINE & SPATIO-TEMPORAL MATCHING
          </span>
        </div>
        <h2 className="text-xl lg:text-2xl font-display font-bold text-white tracking-tight">
          Vessel Attribution Analysis
        </h2>
        <p className="text-xs lg:text-sm text-cyan-200/80 italic font-mono mt-0.5">
          “Correlating vessel trajectories, transponder gaps, and hydrodynamic spill back-drifting.”
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: VESSEL RANKING LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
              Attribution Ranking Candidates
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Sorted by Score</span>
          </div>

          <div className="space-y-3">
            {VESSELS.filter(v => v.id !== 'coastguard').map((vessel) => {
              const isSelected = selectedVesselId === vessel.id;
              
              return (
                <div
                  key={vessel.id}
                  onClick={() => setSelectedVesselId(vessel.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#0d203f] to-[#08152b] border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                      : "bg-[#071326] border-slate-800 hover:border-cyan-800 hover:bg-[#0a1b34]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center ${
                        vessel.rank === 1 ? "bg-red-600 text-white shadow-[0_0_10px_#ef4444]" : "bg-slate-800 text-slate-300"
                      }`}>
                        #{vessel.rank}
                      </span>
                      <div>
                        <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                          {vessel.name}
                          {vessel.rank === 1 && <span className="text-xs">🔴</span>}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400">
                          {vessel.type} · MMSI: <span className="text-cyan-300">{vessel.mmsi}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-display font-black ${
                          vessel.attributionScore >= 80 ? 'text-red-400' :
                          vessel.attributionScore >= 30 ? 'text-amber-300' :
                          'text-emerald-400'
                        }`}>
                          {vessel.attributionScore}
                        </span>
                        <span className="text-xs font-mono text-slate-400">/100</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase">
                        {vessel.confidenceCategory} Conf.
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Score Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3 p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        vessel.attributionScore >= 80 ? 'bg-gradient-to-r from-amber-500 to-red-500 shadow-[0_0_8px_#ef4444]' :
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
          
          <div className="bg-[#071326] rounded-xl border border-cyan-900/50 p-6 shadow-2xl space-y-6">
            
            {/* Selected Vessel Overview Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                  DETAILED CANDIDATE EVIDENCE INSPECTION
                </span>
                <h3 className="text-2xl font-display font-bold text-white mt-0.5 flex items-center gap-2">
                  {selectedVessel.name}
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                    {selectedVessel.type}
                  </span>
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  MMSI: <span className="text-cyan-300">{selectedVessel.mmsi}</span> · Flag: <span className="text-slate-200">{selectedVessel.flag}</span>
                </p>
              </div>

              <div className="bg-[#040a17] p-3 rounded-xl border border-slate-800 text-center min-w-[130px]">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">OVERALL SCORE</span>
                <span className={`text-3xl font-display font-black ${
                  selectedVessel.attributionScore >= 80 ? 'text-red-400' :
                  selectedVessel.attributionScore >= 30 ? 'text-amber-300' :
                  'text-emerald-400'
                }`}>
                  {selectedVessel.attributionScore}
                  <span className="text-xs font-mono text-slate-400">/100</span>
                </span>
              </div>
            </div>

            {/* Prompt Required Narrative Box */}
            <div className="bg-red-950/30 p-4 rounded-xl border border-red-900/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                AIS Anomaly Log Summary:
              </div>
              <p className="text-xs font-mono text-slate-200 leading-relaxed font-semibold">
                “{selectedVessel.aisGapDetails}”
              </p>
              <p className="text-xs font-mono text-amber-300 leading-relaxed">
                “{selectedVessel.anomalySummary}”
              </p>
            </div>

            {/* THREE ANIMATED SUB-SCORE BARS */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Weighted Score Component Breakdown
              </h4>

              {/* Bar 1: Proximity */}
              <div className="bg-[#040b17] p-4 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-200 font-bold flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Proximity to Origin Point:
                  </span>
                  <span className="text-cyan-300 font-bold text-sm">
                    {selectedVessel.scores.proximity} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="bg-cyan-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_#06b6d4]"
                    style={{ width: `${selectedVessel.scores.proximity}%` }}
                  />
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  Calculates minimum distance between vessel track geometry and back-drifted leak origin coordinates.
                </p>
              </div>

              {/* Bar 2: AIS Gap */}
              <div className="bg-[#040b17] p-4 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-200 font-bold flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-red-400" />
                    AIS Transponder Gap Duration:
                  </span>
                  <span className="text-red-400 font-bold text-sm">
                    {selectedVessel.scores.aisGap} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="bg-red-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_#ef4444]"
                    style={{ width: `${selectedVessel.scores.aisGap}%` }}
                  />
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  Measures unmonitored transponder blackout duration relative to estimated discharge timeframe.
                </p>
              </div>

              {/* Bar 3: Speed Anomaly */}
              <div className="bg-[#040b17] p-4 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-200 font-bold flex items-center gap-2">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    Post-Gap Speed & Acceleration Anomaly:
                  </span>
                  <span className="text-amber-400 font-bold text-sm">
                    {selectedVessel.scores.speedAnomaly} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_#f59e0b]"
                    style={{ width: `${selectedVessel.scores.speedAnomaly}%` }}
                  />
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  Detects abnormal post-discharge acceleration profiles (+6.2 kt delta on MV Solara).
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
