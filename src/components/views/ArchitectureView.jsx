import React from 'react';
import { 
  Network, 
  Satellite, 
  Download, 
  Sliders, 
  Cpu, 
  CheckCircle, 
  Radio, 
  Compass, 
  Target, 
  FileText,
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
      <div className="bg-gradient-to-r from-[#071328] via-[#0a1b38] to-[#071328] p-5 rounded-xl border border-cyan-900/40 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Network className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
            END-TO-END TECHNICAL PIPELINE & DATA INFRASTRUCTURE
          </span>
        </div>
        <h2 className="text-xl lg:text-2xl font-display font-bold text-white tracking-tight">
          System Architecture & Flow Diagram
        </h2>
        <p className="text-xs lg:text-sm text-cyan-200/80 italic font-mono mt-0.5">
          “Multi-stage stream processing from raw orbital radar backscatter to court-admissible evidence.”
        </p>
      </div>

      {/* VISUAL PIPELINE DIAGRAM SECTION */}
      <div className="bg-[#071326] rounded-xl border border-cyan-900/40 p-6 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Sequential Ingestion & Attribution Pipeline
          </span>
          <span className="text-[10px] font-mono text-slate-400">9 Connected Core Nodes</span>
        </div>

        {/* 9 Stage Flow Diagram (Horizontal / Vertical Responsive Flow) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2.5 pt-2">
          {ARCHITECTURE_STEPS.map((step, idx) => (
            <div 
              key={step.step}
              className="bg-[#040b17] p-3 rounded-lg border border-cyan-900/60 hover:border-cyan-400 flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/50">
                    {step.step}
                  </span>
                  {idx < ARCHITECTURE_STEPS.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 hidden lg:block" />
                  )}
                </div>

                <h4 className="text-xs font-display font-bold text-white mb-1 group-hover:text-cyan-200">
                  {step.name}
                </h4>
                <p className="text-[10px] font-mono text-slate-400 leading-snug">
                  {step.desc}
                </p>
              </div>

              <div className="mt-3 pt-1 border-t border-slate-800/60 h-0.5 bg-slate-800 group-hover:bg-cyan-400 transition-colors" />
            </div>
          ))}
        </div>

      </div>

      {/* TECHNOLOGY STACK CARDS */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          Production Technology Stack & Frameworks
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ARCH_TECH_STACK.map((tech, idx) => (
            <div 
              key={idx}
              className="bg-[#071326] p-4 rounded-xl border border-cyan-900/40 hover:border-cyan-500/60 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{tech.category}</span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    {tech.badge}
                  </span>
                </div>
                <h4 className="text-sm font-display font-bold text-white mb-1">{tech.name}</h4>
                <p className="text-xs font-mono text-slate-400">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADVANCED FEATURES GRID */}
      <div className="bg-gradient-to-br from-[#08172e] via-[#061224] to-[#040c19] p-6 rounded-xl border border-cyan-900/50 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Advanced System Features & Capabilities
          </h3>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
            ENTERPRISE GRADE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {ADVANCED_FEATURES.map((feat, idx) => (
            <div 
              key={idx}
              className="bg-[#050c18] p-4 rounded-lg border border-slate-800/80 hover:border-cyan-700/50 transition-all space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <h4 className="font-display font-bold text-xs text-white">{feat.title}</h4>
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
