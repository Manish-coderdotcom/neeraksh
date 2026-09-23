import React from 'react';
import {
  LayoutDashboard,
  Satellite,
  Radio,
  BarChart3,
  AlertTriangle,
  Network,
  FileText,
  Activity,
  ShieldCheck,
  Globe,
  LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Live' },
  { id: 'satellite', label: 'Satellite Imagery', icon: Satellite, badge: 'SAR' },
  { id: 'ais', label: 'AIS Vessel Data', icon: Radio, badge: '5 Ships' },
  { id: 'analysis', label: 'Attribution Analysis', icon: BarChart3, badge: 'Attribution' },
  { id: 'challenges', label: 'Technical Challenges', icon: AlertTriangle, badge: '5 Solved' },
  { id: 'architecture', label: 'System Architecture', icon: Network, badge: 'Pipeline' },
  { id: 'reports', label: 'Reports & Export', icon: FileText, badge: 'PDF' },
];

export default function Sidebar({ currentView, onViewChange, isOpen, onToggle, currentUser, onLogout }) {
  return (
    <aside className={`bg-[#0d1527] border-r border-slate-800/80 w-64 flex-shrink-0 flex flex-col justify-between transition-transform duration-300 z-30 fixed md:static inset-y-0 left-0 pt-16 md:pt-0 ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
      }`}>

      {/* Top Navigation Section */}
      <div className="p-4 overflow-y-auto">

        {/* Navigation Section Title */}
        <div className="px-3 mb-2.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform Views
          </span>
          <span className="text-[10px] font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
            v2.4
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onViewChange(item.id);
                  if (window.innerWidth < 768 && onToggle) onToggle();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${isActive
                    ? "bg-sky-500/10 text-sky-300 border-l-2 border-sky-400 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                  <span className="font-sans text-xs">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isActive
                      ? "bg-sky-500/20 text-sky-200"
                      : "bg-slate-800 text-slate-400"
                    }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active Incident Summary Card in Sidebar */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2.5 pb-2 border-b border-slate-800/80">
            <span className="text-xs text-sky-400 font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              Active Incident
            </span>
            <span className="text-[10px] font-medium text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/40">
              High Confidence
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[11px]">Case ID:</span>
              <span className="text-sky-300 font-mono text-[11px]">INC-2026-0906</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[11px]">Suspect:</span>
              <span className="text-rose-400 font-semibold">MV Solara</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[11px]">Match Score:</span>
              <span className="text-emerald-400 font-bold">91 / 100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[11px]">Estimated Slick:</span>
              <span className="text-amber-300 font-medium">14.8 - 28.4 km²</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Status Card */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0a101f]">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
            Telemetry Status
          </span>
        </div>

        <div className="space-y-1 text-[11px] text-slate-400">
          <div className="flex justify-between items-center">
            <span>Sentinel-1 Feed:</span>
            <span className="text-emerald-400 font-medium">Online</span>
          </div>
          <div className="flex justify-between items-center">
            <span>AIS Live Feed:</span>
            <span className="text-emerald-400 font-medium">Connected</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Segmentation Engine:</span>
            <span className="text-sky-400 font-medium">Ready</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-sky-400" />
            North Sea Grid 4B
          </span>
          <span>EPSG:4326</span>
        </div>

        {/* Authenticated Operator Quick Status & Lock */}
        {currentUser && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate font-medium">{currentUser.callsign}</span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              title="Lock terminal session"
              className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 shrink-0 px-2 py-1 rounded hover:bg-slate-800 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-xs">Lock</span>
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}
