import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  X, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  Compass, 
  Radio, 
  Cpu, 
  Droplet, 
  Fish, 
  AlertOctagon 
} from 'lucide-react';

export const DEMO_STAGES = [
  {
    step: 1,
    title: "1. Detect Satellite Slick",
    targetView: "satellite",
    timeHorizon: "0H",
    description: "Sentinel-1 C-SAR radar passes over Sector 4B; U-Net model extracts 14.8 km² dark backscatter anomaly.",
    status: "SAR Anomaly Ingested (94% Conf)",
    icon: Compass,
    durationMs: 4000,
  },
  {
    step: 2,
    title: "2. Identify Oil Type",
    targetView: "oil-type",
    timeHorizon: "0H",
    description: "AI analyzes -11.4 dB radar damping & NDOI reflectance -> Classifies as Heavy Crude Oil (19.4° API).",
    status: "Heavy Crude Oil (Viscosity 185 cSt)",
    icon: Droplet,
    durationMs: 4000,
  },
  {
    step: 3,
    title: "3. Correlate Potential Source Vessel",
    targetView: "vessel-source",
    timeHorizon: "0H",
    description: "Bayesian correlation detects 2-hour AIS transponder gap on MV Solara with +6.2 kt acceleration anomaly.",
    status: "MV Solara Attributed (91/100 Score)",
    icon: Radio,
    durationMs: 4500,
  },
  {
    step: 4,
    title: "4. Predict 72-Hour Trajectory",
    targetView: "prediction",
    timeHorizon: "24H",
    description: "Hydrodynamic Euler drift model integrates SW wind (14.2 kt) & NE current (1.25 kt) across 6h-72h horizons.",
    status: "Drift Heading 048° NE @ 1.62 kt",
    icon: Compass,
    durationMs: 4500,
  },
  {
    step: 5,
    title: "5. Generate Spatial Risk Zones",
    targetView: "risk-zones",
    timeHorizon: "24H",
    description: "Dynamic multi-factor risk envelopes generated: Red (Critical 8 NM), Orange (High 16 NM), Yellow (28 NM), Green (45 NM).",
    status: "4 Concentric Risk Bands Active",
    icon: AlertOctagon,
    durationMs: 4000,
  },
  {
    step: 6,
    title: "6. Calculate Ecosystem Exposure",
    targetView: "ecosystem",
    timeHorizon: "24H",
    description: "Spatial overlap flags Lophelia coral bioherm (ETA 28h) and Herring spawning grounds (ETA 14h) at critical threat.",
    status: "Critical Habitat Exposure Warning",
    icon: Fish,
    durationMs: 4000,
  },
  {
    step: 7,
    title: "7. Simulate Future Consequences",
    targetView: "consequences",
    timeHorizon: "48H",
    description: "Consequence engine projects 47.5 km² slick growth, 11.2 NM shoreline proximity, and $18.4M economic exposure.",
    status: "Cleanup Difficulty: 78/100 Index",
    icon: Cpu,
    durationMs: 4500,
  },
  {
    step: 8,
    title: "8. Optimize Emergency Response",
    targetView: "emergency",
    timeHorizon: "48H",
    description: "Response optimizer dispatches KV Bergen with Ro-Boom 2000, skimmer barge #2, and thermal drone unit Alpha-9.",
    status: "Fleet Intercept ETA: 1h 45m (-74% Risk)",
    icon: Radio,
    durationMs: 4500,
  },
  {
    step: 9,
    title: "9. Full 3D Digital Ocean Twin",
    targetView: "digital-twin",
    timeHorizon: "72H",
    description: "Full coupled 3D digital twin visualization synchronizing all 8 layers on the interactive Earth globe.",
    status: "Digital Twin Synchronized (Live)",
    icon: Sparkles,
    durationMs: 6000,
  },
];

export default function DemoModeOverlay({
  isOpen,
  onClose,
  onNavigateView,
  onSetTimeHorizon,
}) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const activeStage = DEMO_STAGES[currentStepIdx] || DEMO_STAGES[0];

  useEffect(() => {
    if (!isOpen) return;

    // Trigger navigation when step changes
    if (onNavigateView) onNavigateView(activeStage.targetView);
    if (onSetTimeHorizon) onSetTimeHorizon(activeStage.timeHorizon);

    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStepIdx < DEMO_STAGES.length - 1) {
        setCurrentStepIdx(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, activeStage.durationMs);

    return () => clearTimeout(timer);
  }, [isOpen, currentStepIdx, isPlaying]);

  if (!isOpen) return null;

  const handleStepJump = (idx) => {
    setCurrentStepIdx(idx);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStepIdx < DEMO_STAGES.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-[#091122]/95 backdrop-blur-xl border border-sky-500/80 rounded-2xl shadow-2xl p-4 sm:p-5 text-white animate-slideUp">
      
      {/* Top Banner Row */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
          <span className="font-bold text-xs uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Hackathon & Technical Interview Simulation Mode
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-mono text-slate-300">
            Stage {activeStage.step} of 9
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            title={isPlaying ? "Pause Demo" : "Resume Auto-Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Next Step */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentStepIdx >= DEMO_STAGES.length - 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer disabled:opacity-40"
            title="Step Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            title="Restart from Stage 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer ml-1"
            title="Exit Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Stage Info Details */}
      <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-white">{activeStage.title}</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
              Horizon: {activeStage.timeHorizon}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-snug">{activeStage.description}</p>
        </div>

        <div className="bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 shrink-0 text-right">
          <span className="text-[10px] text-slate-400 block uppercase">Stage Telemetry</span>
          <span className="text-xs font-mono font-bold text-emerald-400">{activeStage.status}</span>
        </div>
      </div>

      {/* 9-Stage Progress Dots / Stepper */}
      <div className="grid grid-cols-9 gap-1.5 pt-2 border-t border-slate-800/80">
        {DEMO_STAGES.map((stg, idx) => {
          const isPassed = currentStepIdx >= idx;
          const isCurrent = currentStepIdx === idx;

          return (
            <button
              key={stg.step}
              type="button"
              onClick={() => handleStepJump(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                isCurrent 
                  ? "bg-sky-400 ring-2 ring-sky-400/50 shadow-sm" 
                  : (isPassed ? "bg-sky-600/80" : "bg-slate-800")
              }`}
              title={stg.title}
            />
          );
        })}
      </div>
    </div>
  );
}
