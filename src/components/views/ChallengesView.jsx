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
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
            Technical Problem Solving
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Challenges & How This Platform Solves Them
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Engineering solutions implemented to tackle cloud cover, look-alikes, dark transponders, and data volumes.
        </p>
      </div>

      {/* Grid of 5 Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CHALLENGES_LIST.map((item) => {
          const IconComp = getIconComponent(item.icon);

          return (
            <div 
              key={item.id}
              className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                {/* Header inside card */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-800 text-sky-400 border border-slate-700/60">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-sky-400 uppercase">
                      Challenge #{item.num}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-semibold text-white mb-3">
                  {item.title}
                </h3>

                {/* Problem Section */}
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-rose-900/30 mb-3 space-y-1">
                  <span className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
                    Operational Challenge:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.problem}
                  </p>
                </div>

                {/* Solution Section */}
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-900/30 mb-4 space-y-1">
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Neeraksh Solution:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {item.solution}
                  </p>
                </div>
              </div>

              {/* Clickable Navigation Link */}
              <button
                type="button"
                onClick={() => onNavigate(item.targetView)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-sky-600 hover:text-white text-sky-300 text-xs font-medium transition-colors border border-slate-700/80 flex items-center justify-between cursor-pointer"
              >
                <span>Inspect in System</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
