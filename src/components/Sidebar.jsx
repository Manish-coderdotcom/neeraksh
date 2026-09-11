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
  LogOut,
  UserCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'LIVE' },
  { id: 'satellite', label: 'Satellite Imagery', icon: Satellite, badge: 'SAR' },
  { id: 'ais', label: 'AIS Data', icon: Radio, badge: '5 Ships' },
  { id: 'analysis', label: 'Analysis', icon: BarChart3, badge: 'Attribution' },
  { id: 'challenges', label: 'Challenges', icon: AlertTriangle, badge: '5 Built-in' },
  { id: 'architecture', label: 'Architecture', icon: Network, badge: 'System' },
  { id: 'reports', label: 'Reports', icon: FileText, badge: 'Export' },
];

export default function Sidebar({ currentView, onViewChange, isOpen, onToggle, currentUser, onLogout }) {
  return (
    <aside className={`bg-[#060e1a] border-r border-slate-800/80 w-64 flex-shrink-0 flex flex-col justify-between transition-all duration-300 z-30 ${
      isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    }`}>
      
      {/* Top Section */}
      <div className="p-4">
        
        {/* Navigation Section Title */}
        <div className="px-3 mb-3 flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
            System Modules
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/50">
            NRT SEC-4
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
                onClick={() => {
                  onViewChange(item.id);
                  if (window.innerWidth < 768 && onToggle) onToggle();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-900/30 text-cyan-300 border-l-2 border-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.1)]"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span className="font-display font-medium text-xs">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    isActive 
                      ? "bg-cyan-500/30 text-cyan-200 border border-cyan-500/40" 
                      : "bg-slate-800/80 text-slate-400 border border-slate-700/50"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active Incident Summary Box in Sidebar */}
        <div className="mt-6 p-3 rounded-lg bg-gradient-to-b from-[#0a182d] to-[#071120] border border-cyan-900/40">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-[10px] text-cyan-400 font-semibold uppercase flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              Focus Incident
            </span>
            <span className="text-[10px] font-mono text-red-400 font-bold bg-red-950/60 px-1 py-0.5 rounded border border-red-800/50">
              HIGH CONF
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">ID:</span>
              <span className="text-cyan-300 font-semibold">INC-2026-0906</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target:</span>
              <span className="text-red-400 font-semibold">MV Solara</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Score:</span>
              <span className="text-emerald-400 font-bold">91 / 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Slick Area:</span>
              <span className="text-amber-300">14.8 - 28.4 km²</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Status Card */}
      <div className="p-4 border-t border-slate-800/80 bg-[#040912]">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
            System Diagnostics
          </span>
        </div>
        
        <div className="space-y-1 text-[10px] font-mono text-slate-400">
          <div className="flex justify-between">
            <span>Sentinel-1 Sync:</span>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
          </div>
          <div className="flex justify-between">
            <span>AIS Stream (Global):</span>
            <span className="text-emerald-400 font-semibold">CONNECTED</span>
          </div>
          <div className="flex justify-between">
            <span>UNet Inference GPU:</span>
            <span className="text-cyan-400 font-semibold">READY</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-cyan-400" />
            North Sea Grid 4B
          </span>
          <span>EPSG:4326</span>
        </div>

        {/* Authenticated Operator Quick Status & Lock */}
        {currentUser && (
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-cyan-300 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
              <span className="truncate font-semibold text-slate-200">{currentUser.callsign}</span>
            </div>
            <button
              onClick={onLogout}
              title="Lock terminal"
              className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded hover:bg-red-950/40 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Lock</span>
            </button>
          </div>
        )}
      </div>

    </aside>
  );
}
