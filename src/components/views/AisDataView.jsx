import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Anchor, 
  ArrowUpRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { VESSELS } from '../../data/mockData';

export default function AisDataView({ onSelectVessel, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVessel, setSelectedVessel] = useState(VESSELS[0]);

  const filteredVessels = VESSELS.filter(vessel => {
    const matchesSearch = vessel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vessel.mmsi.includes(searchQuery) ||
                          vessel.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'SIGNAL_LOST') return matchesSearch && vessel.statusBadge === 'red';
    if (statusFilter === 'ACTIVE') return matchesSearch && vessel.statusBadge === 'green';
    if (statusFilter === 'RESPONDER') return matchesSearch && vessel.statusBadge === 'blue';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#071328] via-[#0a1b38] to-[#071328] p-5 rounded-xl border border-cyan-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">
              AUTOMATIC IDENTIFICATION SYSTEM (AIS) CORRELATION
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-display font-bold text-white tracking-tight">
            AIS Telemetry & Vessel Tracking Table
          </h2>
          <p className="text-xs lg:text-sm text-cyan-200/80 italic font-mono mt-0.5">
            “Real-time Automatic Identification System feed correlated with SAR satellite passes.”
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>AIS Stream Active (1 Hz)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#071326] p-4 rounded-xl border border-cyan-900/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by Vessel Name, MMSI, Type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#040a17] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Filter:
          </span>

          {[
            { id: 'ALL', label: 'All (5)' },
            { id: 'SIGNAL_LOST', label: 'Signal Lost (1)' },
            { id: 'ACTIVE', label: 'Active (3)' },
            { id: 'RESPONDER', label: 'Responder (1)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1.5 rounded text-xs font-mono transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-[#040a17] text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* PROFESSIONAL VESSEL TRACKING TABLE */}
      <div className="bg-[#071326] rounded-xl border border-cyan-900/40 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#050c19] text-[11px] font-mono text-cyan-400/90 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Vessel Name & Flag</th>
                <th className="py-3 px-4">MMSI</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">AIS Status</th>
                <th className="py-3 px-4">Speed</th>
                <th className="py-3 px-4">Cross-checked via SAR</th>
                <th className="py-3 px-4 text-right">Attribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-xs text-slate-200">
              {filteredVessels.map((vessel) => {
                const isSelected = selectedVessel.id === vessel.id;
                
                return (
                  <tr 
                    key={vessel.id}
                    onClick={() => setSelectedVessel(vessel)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-[#0d1e38] border-l-4 border-l-cyan-400' 
                        : 'hover:bg-[#0a182d]'
                    }`}
                  >
                    {/* Vessel Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <Anchor className={`w-4 h-4 ${vessel.id === 'solara' ? 'text-red-400' : 'text-cyan-400'}`} />
                        <div>
                          <span className="font-sans font-bold text-sm text-white block">
                            {vessel.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{vessel.flag}</span>
                        </div>
                      </div>
                    </td>

                    {/* MMSI */}
                    <td className="py-3.5 px-4 font-semibold text-cyan-300">
                      {vessel.mmsi}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4 text-slate-300">
                      {vessel.type}
                    </td>

                    {/* AIS Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold ${
                        vessel.statusBadge === 'red' ? 'bg-red-950 text-red-300 border border-red-800/80' :
                        vessel.statusBadge === 'amber' ? 'bg-amber-950 text-amber-300 border border-amber-800/80' :
                        vessel.statusBadge === 'blue' ? 'bg-blue-950 text-blue-300 border border-blue-800/80' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          vessel.statusBadge === 'red' ? 'bg-red-500 animate-ping' :
                          vessel.statusBadge === 'amber' ? 'bg-amber-500' :
                          vessel.statusBadge === 'blue' ? 'bg-blue-400' :
                          'bg-emerald-400'
                        }`}></span>
                        {vessel.status}
                      </span>
                    </td>

                    {/* Speed */}
                    <td className="py-3.5 px-4 font-bold text-white">
                      {vessel.speed}
                      {vessel.id === 'solara' && (
                        <span className="text-[10px] text-red-400 block font-normal">+6.2kt anomaly</span>
                      )}
                    </td>

                    {/* Cross-checked via SAR */}
                    <td className="py-3.5 px-4">
                      {vessel.sarMatch === 'SAR hull match' ? (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                          SAR hull match
                        </span>
                      ) : vessel.sarMatch === 'Authorized responder' ? (
                        <span className="text-blue-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                          Responder
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Active track</span>
                      )}
                    </td>

                    {/* Attribution Score */}
                    <td className="py-3.5 px-4 text-right">
                      <span className={`text-sm font-bold font-display px-2 py-0.5 rounded ${
                        vessel.attributionScore >= 80 ? 'text-red-400 bg-red-950/80 border border-red-800' :
                        vessel.attributionScore >= 30 ? 'text-amber-300 bg-amber-950/80' :
                        'text-emerald-400'
                      }`}>
                        {vessel.attributionScore}/100
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SELECTED VESSEL DETAILED INSPECTOR PANEL */}
      {selectedVessel && (
        <div className="bg-gradient-to-br from-[#09162c] to-[#060e1d] p-5 rounded-xl border border-cyan-800/60 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                INSPECTING VESSEL TELEMETRY
              </span>
              <h3 className="text-xl font-display font-bold text-white">
                {selectedVessel.name} ({selectedVessel.type})
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                MMSI: <span className="text-cyan-300">{selectedVessel.mmsi}</span> · IMO: <span className="text-slate-200">{selectedVessel.imo}</span> · Callsign: <span className="text-slate-200">{selectedVessel.callsign}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  if (onSelectVessel) onSelectVessel(selectedVessel.id);
                  if (onNavigate) onNavigate('analysis');
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>OPEN ATTRIBUTION ANALYSIS</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs font-mono">
            <div className="bg-[#050c19] p-3.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">AIS Transponder Anomaly Log:</span>
              <p className="text-slate-200 mt-1 leading-relaxed">
                {selectedVessel.aisGapDetails}
              </p>
            </div>

            <div className="bg-[#050c19] p-3.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Summary Narrative:</span>
              <p className="text-slate-200 mt-1 leading-relaxed">
                {selectedVessel.anomalySummary}
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
