import React from 'react';
import { 
  Network, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Server 
} from 'lucide-react';
import { ARCHITECTURE_STEPS, ARCH_TECH_STACK, ADVANCED_FEATURES } from '../../data/mockData';

export default function ArchitectureView() {
  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <Network className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
            System Pipeline & Infrastructure
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          System Architecture & Data Flow
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Multi-stage pipeline connecting satellite radar downlinks with terrestrial AIS vessel feeds.
        </p>
      </div>

      {/* Visual Pipeline Diagram Section */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs text-sky-400 uppercase font-semibold tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            Sequential Processing Pipeline
          </span>
          <span className="text-xs text-slate-400 font-mono">9 Sequential Stages</span>
        </div>

        {/* 9 Stage Flow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2.5 pt-1">
          {ARCHITECTURE_STEPS.map((step, idx) => (
            <div 
              key={step.step}
              className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 flex flex-col justify-between transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-semibold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-800/40">
                    {step.step}
                  </span>
                  {idx < ARCHITECTURE_STEPS.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 hidden lg:block" />
                  )}
                </div>

                <h4 className="text-xs font-semibold text-white mb-1">
                  {step.name}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {step.desc}
                </p>
              </div>

              <div className="mt-3 pt-1 border-t border-slate-800/60 h-0.5 bg-transparent group-hover:bg-sky-500 rounded-full transition-colors" />
            </div>
          ))}
        </div>

      </div>

      {/* Technology Stack Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-sky-400" />
          Core Technologies & Libraries
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ARCH_TECH_STACK.map((tech, idx) => (
            <div 
              key={idx}
              className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] text-slate-400 uppercase">{tech.category}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-sky-950 text-sky-300 border border-sky-800/50">
                    {tech.badge}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{tech.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Features Grid */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            Key Platform Capabilities
          </h3>
          <span className="text-xs text-sky-300 bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800/50 font-medium">
            Production Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {ADVANCED_FEATURES.map((feat, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-750 transition-colors space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <h4 className="font-semibold text-xs text-white">{feat.title}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
