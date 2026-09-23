import React from 'react';
import { Satellite, Cpu, Radio, Target, FileText, ChevronRight } from 'lucide-react';

const PIPELINE_STAGES = [
  {
    id: 1,
    title: "1. Satellite Ingestion",
    subtitle: "Sentinel-1 SAR & Sentinel-2 optical coverage",
    icon: Satellite,
    targetView: "satellite",
    stageCode: "Stage 01"
  },
  {
    id: 2,
    title: "2. Slick Detection",
    subtitle: "U-Net segmentation & confidence sizing",
    icon: Cpu,
    targetView: "satellite",
    stageCode: "Stage 02"
  },
  {
    id: 3,
    title: "3. AIS Correlation",
    subtitle: "Vessel tracks & transponder gap detection",
    icon: Radio,
    targetView: "ais",
    stageCode: "Stage 03"
  },
  {
    id: 4,
    title: "4. Vessel Attribution",
    subtitle: "Hydrodynamic drift & spatio-temporal match",
    icon: Target,
    targetView: "analysis",
    stageCode: "Stage 04"
  },
  {
    id: 5,
    title: "5. Legal Evidence Report",
    subtitle: "Dossier generation for coast guard authorities",
    icon: FileText,
    targetView: "reports",
    stageCode: "Stage 05"
  }
];

export default function InvestigationPipeline({ currentView, onSelectStage }) {
  return (
    <div className="bg-[#0b1324] border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
      <div className="max-w-[1800px] mx-auto">
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wide text-sky-400 uppercase">
              Investigation Workflow
            </span>
            <span className="text-slate-500 text-xs hidden sm:inline">|</span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Step-by-step verification from space capture to vessel attribution
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Select a stage to view data
          </span>
        </div>

        {/* 5-Stage Responsive Grid with Step Connectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {PIPELINE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = currentView === stage.targetView;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage(stage.targetView)}
                className={`group relative text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? "bg-[#13233e] border-sky-500/80 text-white shadow-sm ring-1 ring-sky-500/30"
                    : "bg-[#0f1a2e]/70 border-slate-800/80 hover:border-slate-700 hover:bg-[#132038] text-slate-300"
                }`}
              >
                {/* Header row inside stage card */}
                <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-sky-500 text-slate-950 font-bold" 
                        : "bg-slate-800 text-sky-400 group-hover:text-sky-300 group-hover:bg-slate-750"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-mono font-medium ${
                      isActive ? "text-sky-300" : "text-slate-400"
                    }`}>
                      {stage.stageCode}
                    </span>
                  </div>
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 hidden lg:block" />
                  )}
                </div>

                {/* Stage Title */}
                <h3 className={`text-xs font-semibold leading-tight ${
                  isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                }`}>
                  {stage.title}
                </h3>

                {/* Stage Subtitle */}
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  {stage.subtitle}
                </p>

                {/* Bottom indicator line */}
                <div className={`mt-2 h-0.5 w-full rounded-full transition-colors ${
                  isActive ? "bg-sky-400" : "bg-transparent group-hover:bg-slate-700"
                }`} />
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
