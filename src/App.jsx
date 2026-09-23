import React, { useState, lazy, Suspense } from 'react';
import Header from './components/Header';
import InvestigationPipeline from './components/InvestigationPipeline';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import DashboardView from './components/views/DashboardView';

// Code-split / lazy-load specialized views for high-performance initial loading
const SpillPredictionView = lazy(() => import('./components/views/SpillPredictionView'));
const ConsequencesSimulatorView = lazy(() => import('./components/views/ConsequencesSimulatorView'));
const DigitalTwinView = lazy(() => import('./components/views/DigitalTwinView'));
const EcosystemImpactView = lazy(() => import('./components/views/EcosystemImpactView'));
const OilIdentificationView = lazy(() => import('./components/views/OilIdentificationView'));
const RiskZonesView = lazy(() => import('./components/views/RiskZonesView'));
const EmergencyOptimizerView = lazy(() => import('./components/views/EmergencyOptimizerView'));
const VesselSourceView = lazy(() => import('./components/views/VesselSourceView'));
const SatelliteImageryView = lazy(() => import('./components/views/SatelliteImageryView'));
const AisDataView = lazy(() => import('./components/views/AisDataView'));
const AnalysisView = lazy(() => import('./components/views/AnalysisView'));
const ChallengesView = lazy(() => import('./components/views/ChallengesView'));
const ArchitectureView = lazy(() => import('./components/views/ArchitectureView'));
const ReportsView = lazy(() => import('./components/views/ReportsView'));
const DemoModeOverlay = lazy(() => import('./components/DemoModeOverlay'));

import { Menu, X, Loader2 } from 'lucide-react';

const AUTH_STORAGE_KEY = 'neeraksh_auth_session';

function ViewLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-96 gap-3 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
      <span className="text-xs font-mono tracking-wider uppercase">Loading Maritime Geospatial Layer...</span>
    </div>
  );
}

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
  const [isDemoModeOpen, setIsDemoModeOpen] = useState(false);

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
    <div className="min-h-screen bg-[#080e1a] text-slate-100 font-sans flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      
      {/* Fixed Header with Official Logo, Live Status, Demo Mode Button, and Operator Profile */}
      <Header 
        onQuickViewChange={(view) => handleNavigate(view)} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onLaunchDemo={() => setIsDemoModeOpen(true)}
      />

      {/* 5-Stage Investigation Pipeline */}
      <InvestigationPipeline 
        currentView={currentView}
        onSelectStage={(stageView) => handleNavigate(stageView)}
      />

      {/* Main Body Container with Sidebar and Content View */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto relative">
        
        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar overlay"
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-25 md:hidden transition-opacity"
          />
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          className="md:hidden fixed bottom-5 right-5 z-50 p-3 rounded-full bg-sky-600 hover:bg-sky-500 text-white shadow-lg border border-sky-400/40 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Navigation Sidebar with Categorized Modules */}
        <Sidebar 
          currentView={currentView}
          onViewChange={(view) => handleNavigate(view)}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLaunchDemo={() => setIsDemoModeOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-7 min-w-0 overflow-x-hidden">
          <Suspense fallback={<ViewLoader />}>
            {/* 1. Incident Command Center Dashboard */}
            {currentView === 'dashboard' && (
              <DashboardView 
                onNavigate={(view) => handleNavigate(view)} 
                onLaunchDemo={() => setIsDemoModeOpen(true)}
              />
            )}

            {/* 2. Digital Ocean Twin (8 Layers) */}
            {currentView === 'digital-twin' && (
              <DigitalTwinView />
            )}

            {/* 3. AI Spill Prediction (0-72h) */}
            {currentView === 'prediction' && (
              <SpillPredictionView />
            )}

            {/* 4. Future Consequences Simulator */}
            {currentView === 'consequences' && (
              <ConsequencesSimulatorView />
            )}

            {/* 5. Automatic Risk Zones */}
            {currentView === 'risk-zones' && (
              <RiskZonesView />
            )}

            {/* 6. Marine Ecosystem Impact */}
            {currentView === 'ecosystem' && (
              <EcosystemImpactView />
            )}

            {/* 7. Emergency Response Optimizer */}
            {currentView === 'emergency' && (
              <EmergencyOptimizerView />
            )}

            {/* 8. Oil Type Identification */}
            {currentView === 'oil-type' && (
              <OilIdentificationView />
            )}

            {/* 9. Vessel Source Attribution */}
            {currentView === 'vessel-source' && (
              <VesselSourceView />
            )}

            {/* Preserved Core Modules */}
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
          </Suspense>
        </main>

      </div>

      {/* Floating Automated Hackathon/Interview Demo Mode Player */}
      <Suspense fallback={null}>
        <DemoModeOverlay
          isOpen={isDemoModeOpen}
          onClose={() => setIsDemoModeOpen(false)}
          onNavigateView={(view) => setCurrentView(view)}
          onSetTimeHorizon={() => {}}
        />
      </Suspense>

      {/* Clean Maritime Command Footer */}
      <footer className="bg-[#060b14] border-t border-slate-800/80 py-3.5 px-4 sm:px-8 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Neeraksh Logo" className="w-4 h-4 rounded-full object-contain" />
          <span className="font-semibold text-slate-300">TEAM NEERAKSH</span>
          <span className="text-slate-600">·</span>
          <span>TIDEMARK Maritime Geospatial Intelligence</span>
        </div>
        <div className="text-slate-400 text-center sm:text-right font-mono text-[11px]">
          Decision-Support Command Platform · Sentinel-1 C-SAR & Automated AIS Telemetry Fusion
        </div>
      </footer>

    </div>
  );
}
