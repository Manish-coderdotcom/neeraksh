import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Clock, 
  AlertTriangle, 
  Fish, 
  ShieldAlert, 
  TrendingUp, 
  Anchor,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useMaritime } from '../../context/MaritimeContext';

export default function FutureConsequencesModal() {
  const { activeModal, closeModal, setHorizon, focusOnCoordinates } = useMaritime();
  const [selectedTab, setSelectedTab] = useState('24H');

  if (activeModal !== 'CONSEQUENCES') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0b1325] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0f1a33]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Predictive Consequence Engine
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  Hydrodynamic Multi-Horizon
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Future Consequence & Habitat Exposure Simulator
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons: 24 HOURS, 48 HOURS, 72 HOURS */}
        <div className="flex items-center gap-2 px-6 pt-5 pb-1 border-b border-slate-800/80 bg-[#0c162b]">
          {[
            { id: '24H', label: '24 HOURS (T+24h)', badge: 'Ecosystem Threat' },
            { id: '48H', label: '48 HOURS (T+48h)', badge: 'Coastal Threat' },
            { id: '72H', label: '72 HOURS (T+72h)', badge: 'Landfall Ingress' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedTab(tab.id);
                setHorizon(tab.id);
              }}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border-t border-x ${
                selectedTab === tab.id
                  ? 'bg-[#0f1d38] text-white border-amber-500/60 border-b-transparent shadow-sm'
                  : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                selectedTab === tab.id ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* 24 HOURS TAB */}
          {selectedTab === '24H' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Spill Area (24H)
                  </span>
                  <span className="text-2xl font-bold text-amber-400 font-mono">26.4 km²</span>
                  <span className="text-[10px] text-slate-400 block mt-1">+78% expansion</span>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Shoreline Distance
                  </span>
                  <span className="text-2xl font-bold text-sky-400 font-mono">21.5 NM</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Outer shelf boundary</span>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 sm:col-span-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Marine Ecosystem Exposure
                  </span>
                  <span className="text-sm font-bold text-rose-400 block">
                    Herring Spawning Ground #12 & Lophelia Outer Periphery
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">High pelagic larval clutch mortality</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>Number of Commercial Vessels in Drift Corridor:</span>
                  <span className="text-amber-400 font-mono font-bold text-sm">6 Vessels Intercepted</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[45%]" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hydrodynamic drift heading 052° NE at 1.48 knots. Dispersal envelope covers 6 cargo/tanker fairways. Automatic hazard broadcast sent to regional VTS centres.
                </p>
              </div>
            </div>
          )}

          {/* 48 HOURS TAB */}
          {selectedTab === '48H' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Spill Area (48H)
                  </span>
                  <span className="text-2xl font-bold text-rose-400 font-mono">47.5 km²</span>
                  <span className="text-[10px] text-slate-400 block mt-1">+221% expansion</span>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Shoreline Threat
                  </span>
                  <span className="text-2xl font-bold text-rose-500 font-mono">11.2 NM</span>
                  <span className="text-[10px] text-rose-400 block mt-1">Critical threshold</span>
                </div>
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 sm:col-span-2">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Protected Area Exposure
                  </span>
                  <span className="text-sm font-bold text-orange-400 block">
                    Vestland Coastal Nature Reserve & Outer Skerries
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Seabird nesting colonies within 48h drift fan</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Coastal Impact Advisory</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Persistent south-westerly wind shear pushes hydrocarbon emulsion towards Outer Fedje archipelago. Landfall probability reaches 61.5%. Emergency coastal deflection boom staging required within 12 hours.
                </p>
              </div>
            </div>
          )}

          {/* 72 HOURS TAB */}
          {selectedTab === '72H' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900/90 p-4 rounded-xl border border-rose-800/60">
                  <span className="text-[11px] text-rose-400 uppercase tracking-wider block mb-1">
                    Estimated Ecosystem Impact
                  </span>
                  <span className="text-base font-bold text-white block">Severe Fjord Ingress</span>
                  <p className="text-xs text-slate-300 mt-1">
                    Direct contamination risk to Sognefjord gateway and Atlantic salmon sea-cages.
                  </p>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-800/60">
                  <span className="text-[11px] text-amber-400 uppercase tracking-wider block mb-1">
                    Fisheries Exposure
                  </span>
                  <span className="text-base font-bold text-amber-300 block">$18.4M Catch Value</span>
                  <p className="text-xs text-slate-300 mt-1">
                    Immediate commercial pelagic catch moratorium and processing suspension.
                  </p>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-rose-800/60">
                  <span className="text-[11px] text-rose-400 uppercase tracking-wider block mb-1">
                    Coastal Vulnerability
                  </span>
                  <span className="text-2xl font-black text-rose-400 font-mono">88.5% Landfall</span>
                  <p className="text-xs text-slate-300 mt-1">
                    Intertidal rocky shorelines & puffin nesting islets exposed to tar deposition.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Containment Strategy Priority:</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Transition from open-water skimming to nearshore exclusion booming across 14 barrier points. Chemical dispersants prohibited within 5 NM of cold-water coral bioherms.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a1122] border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setHorizon(selectedTab);
              closeModal();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Apply {selectedTab} Horizon to 3D Globe</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={closeModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
