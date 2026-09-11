import React, { useState } from 'react';
import Header from './components/Header';
import InvestigationPipeline from './components/InvestigationPipeline';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import DashboardView from './components/views/DashboardView';
import SatelliteImageryView from './components/views/SatelliteImageryView';
import AisDataView from './components/views/AisDataView';
import AnalysisView from './components/views/AnalysisView';
import ChallengesView from './components/views/ChallengesView';
import ArchitectureView from './components/views/ArchitectureView';
import ReportsView from './components/views/ReportsView';
import { Menu, X } from 'lucide-react';

const AUTH_STORAGE_KEY = 'neeraksh_auth_session';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to load session from storage', e);
      return null;
    }
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedVesselId, setSelectedVesselId] = useState('solara');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    try {
      if (userData.rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      }
    } catch (e) {
      console.warn('Failed to persist session to storage', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear storage session', e);
    }
  };

  const handleNavigate = (viewId, vesselId = null) => {
    setCurrentView(viewId);
    if (vesselId) {
      setSelectedVesselId(vesselId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If unauthenticated, render the cyber-maritime Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#050b14] text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Fixed Header with Operator Status and Logout */}
      <Header 
        onQuickViewChange={(view) => handleNavigate(view)} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 5-Stage Investigation Pipeline */}
      <InvestigationPipeline 
        currentView={currentView}
        onSelectStage={(stageView) => handleNavigate(stageView)}
      />

      {/* Main Body Container with Sidebar and Content View */}
      <div className="flex-1 flex max-w-[1800px] w-full mx-auto relative">
        
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed bottom-5 right-5 z-50 p-3.5 rounded-full bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.5)] font-bold flex items-center justify-center cursor-pointer"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation Sidebar */}
        <Sidebar 
          currentView={currentView}
          onViewChange={(view) => handleNavigate(view)}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 min-w-0 overflow-x-hidden">
          
          {currentView === 'dashboard' && (
            <DashboardView onNavigate={(view) => handleNavigate(view)} />
          )}

          {currentView === 'satellite' && (
            <SatelliteImageryView />
          )}

          {currentView === 'ais' && (
            <AisDataView 
              onSelectVessel={(id) => handleNavigate('analysis', id)}
              onNavigate={(view) => handleNavigate(view)}
            />
          )}

          {currentView === 'analysis' && (
            <AnalysisView />
          )}

          {currentView === 'challenges' && (
            <ChallengesView onNavigate={(view) => handleNavigate(view)} />
          )}

          {currentView === 'architecture' && (
            <ArchitectureView />
          )}

          {currentView === 'reports' && (
            <ReportsView />
          )}

        </main>

      </div>

      {/* Mission Control Footer */}
      <footer className="bg-[#030810] border-t border-slate-800/80 py-4 px-6 text-center text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>TIDEMARK — Oil Spill Detection & Vessel Attribution System</span>
        </div>
        <div className="text-slate-400">
          From space to sea — detecting the spill, tracking the vessel, protecting our oceans.
        </div>
      </footer>

    </div>
  );
}
