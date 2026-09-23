import React, { useState } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertOctagon, 
  Anchor, 
  Plane, 
  Ship, 
  Sliders, 
  TrendingDown, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { EMERGENCY_ACTIONS, INCIDENT_PROFILE } from '../../data/simulationData';

export default function EmergencyOptimizerView() {
  const [strategy, setStrategy] = useState("BALANCED");
  const [completedActions, setCompletedActions] = useState({});
  const [isOptimizing, setIsOptimizing] = useState(false);

  const toggleAction = (id) => {
    setCompletedActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
    }, 500);
  };

  const completedCount = Object.values(completedActions).filter(Boolean).length;
  const simulatedRiskReduction = Math.min(92, 45 + completedCount * 12);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
              Tactical Resource Allocation & Dispatch
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Emergency Response Optimizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Algorithmic prioritization of mechanical containment, high-capacity skimmers, aerial drone reconnaissance, and shoreline barrier defense.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReOptimize}
            disabled={isOptimizing}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? "Re-Evaluating..." : "Optimize Dispatch Plan"}</span>
          </button>
        </div>
      </div>

      {/* Top Strategy & Fleet Readiness Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Strategy Selector */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-4 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Deployment Strategy Mode</span>
          <div className="grid grid-cols-3 gap-1.5">
            {["BALANCED", "RAPID_DEFENSE", "MAX_RECOVERY"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setStrategy(mode)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-medium transition-colors cursor-pointer border ${
                  strategy === mode
                    ? "bg-sky-500/20 border-sky-400 text-sky-200"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Projected Risk Reduction */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Projected Risk Reduction</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">-{simulatedRiskReduction}%</span>
            <span className="text-[10px] text-slate-400 block">{completedCount} of {EMERGENCY_ACTIONS.length} actions executed</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Fleet Deployment ETA */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Fastest Tactical Intercept</span>
            <span className="text-2xl font-black text-sky-400 font-mono">25 Mins</span>
            <span className="text-[10px] text-slate-400 block">Alpha-9 Drone · Thermal Profile</span>
          </div>
          <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 text-sky-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Prioritized Action Sequence Matrix */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-sky-400" />
            Recommended Operational Response Sequence
          </h3>
          <span className="text-xs text-slate-400 font-mono">Ranked by Risk Reduction</span>
        </div>

        <div className="space-y-3">
          {EMERGENCY_ACTIONS.map((action, idx) => {
            const isDone = completedActions[action.id];

            return (
              <div
                key={action.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDone
                    ? "bg-slate-900/40 border-slate-800 opacity-60"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Action Title & Description */}
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        action.priority === 'P1' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        action.priority === 'P2' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-sky-950 text-sky-300 border border-sky-800'
                      }`}>
                        {action.priority} · {action.priorityLabel}
                      </span>
                      <span className="text-xs font-bold text-white">{action.title}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 pt-1">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Assigned Unit:</span>
                        <span className="text-sky-300 font-medium">{action.assignedAsset}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Target Zone:</span>
                        <span className="font-mono text-slate-200">{action.location}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Required Gear:</span>
                        <span className="text-slate-300 text-[11px] truncate block">{action.requiredResources}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: ETA & Action Button */}
                  <div className="flex items-center gap-4 shrink-0 justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">ETA / Distance</span>
                      <span className="text-base font-black text-white font-mono">{action.etaMinutes} min</span>
                      <span className="text-[10px] text-slate-400 block">{action.distanceNM} NM</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleAction(action.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isDone
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-sky-600 hover:bg-sky-500 text-white shadow-xs"
                      }`}
                    >
                      {isDone ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Dispatched</span>
                        </>
                      ) : (
                        <span>Authorize Dispatch</span>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Support Disclaimer */}
      <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Operational Notice:</strong> Recommended emergency sequences represent simulated decision-support optimizations based on vessel proximity and boom deployment speed. Field incident commanders maintain full operational discretion.
        </span>
      </div>
    </div>
  );
}
