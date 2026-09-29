import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Satellite, 
  Droplet, 
  Radio, 
  Target, 
  Wind, 
  TrendingUp, 
  ShieldAlert, 
  FileText,
  X,
  Sparkles
} from 'lucide-react';
import { useMaritime } from '../../context/MaritimeContext';
import { SIMULATION_STEPS } from '../../services/simulationService';

const STEP_ICONS = [
  Satellite,
  Droplet,
  Radio,
  Target,
  Wind,
  TrendingUp,
  TrendingUp,
  ShieldAlert,
  FileText,
];

export default function SimulationRunnerModal() {
  const { simulationState, runIncidentSimulation, stopSimulation, setActiveModal } = useMaritime();

  if (!simulationState.isRunning && !simulationState.completed) {
    return null;
  }

  const currentStepNum = simulationState.step;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0a1120] border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0d172e]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              {simulationState.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                  Automated Maritime Investigation Engine
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  simulationState.completed 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                    : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                }`}>
                  {simulationState.completed ? 'COMPLETED' : `STEP ${currentStepNum} OF 9`}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {simulationState.completed ? 'Full Operational Incident Pipeline Complete' : simulationState.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={stopSimulation}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar Header */}
        <div className="px-6 pt-4 pb-2 bg-[#0c1426]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>PIPELINE PROGRESS</span>
            <span className="text-cyan-300 font-bold">{simulationState.progress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${simulationState.progress}%` }}
            />
          </div>
        </div>

        {/* Live Step Tracker Timeline */}
        <div className="p-6 space-y-3 max-h-[55vh] overflow-y-auto">
          {SIMULATION_STEPS.map((s, idx) => {
            const Icon = STEP_ICONS[idx] || Sparkles;
            const isCurrent = currentStepNum === s.step && simulationState.isRunning;
            const isDone = currentStepNum > s.step || simulationState.completed;

            return (
              <div
                key={s.step}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isCurrent
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md shadow-cyan-950/30'
                    : isDone
                    ? 'bg-slate-900/60 border-emerald-900/40 text-slate-300'
                    : 'bg-slate-900/20 border-slate-800/40 text-slate-400 opacity-60'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                  ) : isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isCurrent ? 'text-white' : isDone ? 'text-slate-200' : 'text-slate-400'}`}>
                      Step {s.step}: {s.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded animate-pulse">
                        RUNNING
                      </span>
                    )}
                    {isDone && (
                      <span className="text-[10px] font-mono text-emerald-400">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-cyan-300 mt-0.5">
                    {s.message}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    {s.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#09101d] border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            {simulationState.completed ? 'All 9 stages synchronized.' : 'Deterministic pipeline executing...'}
          </div>

          <div className="flex items-center gap-2">
            {simulationState.completed ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal('REPORT_EXPORT');
                  }}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Inspect Generated Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={stopSimulation}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Close
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={stopSimulation}
                className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-medium cursor-pointer"
              >
                Abort Simulation
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
