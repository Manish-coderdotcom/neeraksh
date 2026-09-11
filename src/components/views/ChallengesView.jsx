import React from 'react';
import { 
  AlertTriangle, 
  CloudOff, 
  Layers, 
  Radio, 
  Database, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { CHALLENGES_LIST } from '../../data/mockData';

export default function ChallengesView({ onNavigate }) {
  
  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'CloudOff': return CloudOff;
      case 'Layers': return Layers;
      case 'Radio': return Radio;
      case 'Database': return Database;
      case 'Zap': return Zap;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#071328] via-[#0a1b38] to-[#071328] p-5 rounded-xl border border-cyan-900/40 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
            TECHNICAL BOTTLENECK MITIGATION & AI MODEL ARCHITECTURE
          </span>
        </div>
        <h2 className="text-xl lg:text-2xl font-display font-bold text-white tracking-tight">
          Challenges & How This Model Addresses Them
        </h2>
        <p className="text-xs lg:text-sm text-cyan-200/80 italic font-mono mt-0.5">
          “Operational solutions built directly into the TIDEMARK intelligence pipeline.”
        </p>
      </div>

      {/* Grid of 5 Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CHALLENGES_LIST.map((item) => {
          const IconComp = getIconComponent(item.icon);

          return (
            <div 
              key={item.id}
              className="bg-[#071326] rounded-xl border border-cyan-900/40 p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/60 transition-all duration-200 group"
            >
              <div>
                {/* Header inside card */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60 group-hover:text-cyan-300 group-hover:bg-cyan-900/60 transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      CHALLENGE #{item.num}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-display font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
                  {item.title}
                </h3>

                {/* Problem Section */}
                <div className="bg-[#050c18] p-3 rounded-lg border border-red-900/30 mb-3 space-y-1">
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase block flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-red-400" />
                    Operational Problem:
                  </span>
                  <p className="text-xs font-mono text-slate-300 leading-relaxed">
                    {item.problem}
                  </p>
                </div>

                {/* Solution Section */}
                <div className="bg-[#050c18] p-3 rounded-lg border border-emerald-900/40 mb-4 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    TIDEMARK Solution:
                  </span>
                  <p className="text-xs font-mono text-slate-200 leading-relaxed font-medium">
                    {item.solution}
                  </p>
                </div>
              </div>

              {/* Clickable Navigation Link */}
              <button
                onClick={() => onNavigate(item.targetView)}
                className="w-full py-2.5 px-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-mono text-xs font-bold transition-all border border-cyan-800/60 flex items-center justify-between shadow-md"
              >
                <span>{item.linkText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
