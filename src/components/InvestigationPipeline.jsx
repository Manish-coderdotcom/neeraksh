import React from 'react';
import { Satellite, Cpu, Radio, Target, FileText, ChevronRight } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    id: 1,
    title: "Satellite Imagery",
    subtitle: "Optical/SAR satellites capture the ocean surface.",
    icon: Satellite,
    targetView: "satellite",
    stageCode: "STAGE 01"
  },
  {
    id: 2,
    title: "Image Analysis",
    subtitle: "AI/ML detects, classifies and sizes the slick.",
    icon: Cpu,
    targetView: "satellite",
    stageCode: "STAGE 02"
  },
  {
    id: 3,
    title: "AIS Correlation",
    subtitle: "Vessel positions and routes are overlaid.",
    icon: Radio,
    targetView: "ais",
    stageCode: "STAGE 03"
  },
  {
    id: 4,
    title: "Identification",
    subtitle: "Location + time + movement are matched to a vessel.",
    icon: Target,
    targetView: "analysis",
    stageCode: "STAGE 04"
  },
  {
    id: 5,
    title: "Alerts & Action",
    subtitle: "Authorities receive evidence and recommendations.",
    icon: FileText,
    targetView: "reports",
    stageCode: "STAGE 05"
  }
];

export default function InvestigationPipeline({ currentView, onSelectStage }) {
  return (
    <div className="bg-[#091426]/90 border-b border-cyan-900/30 px-4 lg:px-8 py-3">
      <div className="max-w-[1800px] mx-auto">
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Investigation Pipeline Flow
          </span>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            Click any stage to inspect specific analytics phase
          </span>
        </div>

        {/* 5-Stage Responsive Grid with Step Connectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PIPELINE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = currentView === stage.targetView;

            return (
              <button
                key={stage.id}
                onClick={() => onSelectStage(stage.targetView)}
                className={`group relative text-left p-2.5 rounded-lg border transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? "bg-gradient-to-br from-cyan-950/80 to-[#0d1e38] border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "bg-[#0b182d]/80 border-slate-800/80 hover:border-cyan-700/50 hover:bg-[#0f213d]/90"
                }`}
              >
                {/* Header row inside stage card */}
                <div className="flex items-center justify-between gap-1 w-full mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${
                      isActive ? "bg-cyan-500 text-slate-950" : "bg-slate-800/80 text-cyan-400 group-hover:text-cyan-300"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/70 font-semibold">
                      {stage.stageCode}
                    </span>
                  </div>
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 hidden lg:block" />
                  )}
                </div>

                {/* Stage Title */}
                <h3 className={`text-xs font-display font-semibold ${
                  isActive ? "text-cyan-200" : "text-slate-200 group-hover:text-white"
                }`}>
                  {stage.title}
                </h3>

                {/* Stage Subtitle */}
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {stage.subtitle}
                </p>

                {/* Bottom Active Indicator bar */}
                <div className={`mt-2 h-0.5 rounded-full transition-all ${
                  isActive ? "bg-cyan-400 shadow-[0_0_8px_#06b6d4]" : "bg-slate-800 group-hover:bg-cyan-800/50"
                }`} />
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
