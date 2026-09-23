import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Anchor, 
  ArrowUpRight,
  RefreshCw
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
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Radio className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
              Automatic Identification System (AIS)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            AIS Telemetry & Vessel Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time Automatic Identification System feed correlated with SAR satellite surveillance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>AIS Stream Active (1 Hz)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by vessel name, MMSI, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-sky-400" /> Filter:
          </span>

          {[
            { id: 'ALL', label: 'All (5)' },
            { id: 'SIGNAL_LOST', label: 'Signal Lost (1)' },
            { id: 'ACTIVE', label: 'Active (3)' },
            { id: 'RESPONDER', label: 'Responder (1)' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Professional Vessel Tracking Table */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-xs text-slate-300 uppercase tracking-wider border-b border-slate-800">
                <th className="py-3 px-4">Vessel Name & Flag</th>
                <th className="py-3 px-4">MMSI</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">AIS Status</th>
                <th className="py-3 px-4">Speed</th>
                <th className="py-3 px-4">SAR Cross-Check</th>
                <th className="py-3 px-4 text-right">Attribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
              {filteredVessels.map((vessel) => {
                const isSelected = selectedVessel.id === vessel.id;
                
                return (
                  <tr 
                    key={vessel.id}
                    onClick={() => setSelectedVessel(vessel)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-sky-950/40 border-l-4 border-l-sky-400' 
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Vessel Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <Anchor className={`w-4 h-4 ${vessel.id === 'solara' ? 'text-rose-400' : 'text-sky-400'}`} />
                        <div>
                          <span className="font-semibold text-sm text-white block">
                            {vessel.name}
                          </span>
                          <span className="text-[11px] text-slate-400">{vessel.flag}</span>
                        </div>
                      </div>
                    </td>

                    {/* MMSI */}
                    <td className="py-3.5 px-4 font-mono font-medium text-sky-300">
                      {vessel.mmsi}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4 text-slate-300">
                      {vessel.type}
                    </td>

                    {/* AIS Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${
                        vessel.statusBadge === 'red' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/40' :
                        vessel.statusBadge === 'amber' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40' :
                        vessel.statusBadge === 'blue' ? 'bg-sky-950/80 text-sky-300 border border-sky-800/40' :
                        'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          vessel.statusBadge === 'red' ? 'bg-rose-500' :
                          vessel.statusBadge === 'amber' ? 'bg-amber-500' :
                          vessel.statusBadge === 'blue' ? 'bg-sky-400' :
                          'bg-emerald-400'
                        }`}></span>
                        {vessel.status}
                      </span>
                    </td>

                    {/* Speed */}
                    <td className="py-3.5 px-4 font-medium text-white">
                      {vessel.speed}
                      {vessel.id === 'solara' && (
                        <span className="text-[10px] text-rose-400 block font-normal">+6.2 kt anomaly</span>
                      )}
                    </td>

                    {/* Cross-checked via SAR */}
                    <td className="py-3.5 px-4">
                      {vessel.sarMatch === 'SAR hull match' ? (
                        <span className="text-rose-400 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                          SAR Hull Match
                        </span>
                      ) : vessel.sarMatch === 'Authorized responder' ? (
                        <span className="text-sky-300 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                          Responder
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Active Track</span>
                      )}
                    </td>

                    {/* Attribution Score */}
                    <td className="py-3.5 px-4 text-right">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        vessel.attributionScore >= 80 ? 'text-rose-400 bg-rose-950/80 border border-rose-800/60' :
                        vessel.attributionScore >= 30 ? 'text-amber-300 bg-amber-950/80' :
                        'text-emerald-400 bg-emerald-950/80'
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

      {/* Selected Vessel Detailed Inspector Panel */}
      {selectedVessel && (
        <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">
                Inspecting Vessel Telemetry
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                {selectedVessel.name} ({selectedVessel.type})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                MMSI: <span className="text-sky-300 font-mono">{selectedVessel.mmsi}</span> · IMO: <span className="text-slate-200 font-mono">{selectedVessel.imo}</span> · Callsign: <span className="text-slate-200 font-mono">{selectedVessel.callsign}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => {
                  if (onSelectVessel) onSelectVessel(selectedVessel.id);
                  if (onNavigate) onNavigate('analysis');
                }}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Attribution Analysis</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] font-medium uppercase mb-1">AIS Transponder Anomaly Log:</span>
              <p className="text-slate-200 leading-relaxed">
                {selectedVessel.aisGapDetails}
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px] font-medium uppercase mb-1">Summary Narrative:</span>
              <p className="text-slate-200 leading-relaxed">
                {selectedVessel.anomalySummary}
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
