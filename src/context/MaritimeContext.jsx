import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import incidentsData from '../data/incidents.json';
import vesselsData from '../data/vessels.json';
import environmentalData from '../data/environmental.json';
import predictionsData from '../data/predictions.json';
import protectedAreasData from '../data/protectedAreas.json';

import { simulationService } from '../services/simulationService';
import { vesselService } from '../services/vesselService';
import { spillPredictionService } from '../services/spillPredictionService';
import { environmentService } from '../services/environmentService';
import { reportService } from '../services/reportService';
import { aisService } from '../services/aisService';

const MaritimeContext = createContext(null);

export function MaritimeProvider({ children, currentView, onNavigate }) {
  // 1. Incidents & Active Case
  const [incidents] = useState(incidentsData);
  const [currentIncident, setCurrentIncident] = useState(incidentsData[0]);

  // 2. Vessels & Forensic Attribution
  const [vessels, setVessels] = useState(vesselsData);
  const [selectedVesselId, setSelectedVesselId] = useState('solara');
  const [vesselFilter, setVesselFilter] = useState({ type: 'ALL', nearSpillOnly: false });

  // 3. Time Horizon & Scrubber
  // Horizons: 0H (0h), 6H (6h), 12H (12h), 24H (24h), 48H (48h), 72H (72h)
  const [activeHorizon, setActiveHorizon] = useState('0H');
  const [timelineProgress, setTimelineProgressState] = useState(0); // 0 to 100
  const [isPlaying, setIsPlaying] = useState(false);

  // 4. Nine Toggleable Geospatial Layers
  const [layers, setLayers] = useState({
    satelliteSar: true,
    aisVessels: true,
    oilSpill: true,
    drift24h: true,
    drift48h: true,
    protectedAreas: true,
    coralEcosystem: true,
    riskZones: true,
    coastline: true,
    aisTracks: true,
    chartGrid: true,
  });

  const toggleLayer = useCallback((layerKey) => {
    setLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  // 5. Active Modals & Clicked Interactive Entities
  const [activeModal, setActiveModal] = useState(null); // 'SPILL_INFO' | 'VESSEL_INFO' | 'CONSEQUENCES' | 'RISK_ZONES' | 'OIL_ANALYSIS' | 'INCIDENT_DOSSIER' | 'REPORT_EXPORT' | 'SEARCH_RESULTS'
  const [selectedEntity, setSelectedEntity] = useState(null);

  // 6. Camera Focus Coordinates for 3D Globe / 2D Map
  const [cameraFocusTarget, setCameraFocusTarget] = useState(null);
  const [resetCameraCounter, setResetCameraCounter] = useState(0);

  // 7. Notification Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', durationMs = 3500) => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, durationMs);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // 8. Dynamic Simulation Runner State
  const [simulationState, setSimulationState] = useState({
    isRunning: false,
    step: 0,
    totalSteps: 9,
    title: '',
    message: '',
    subtext: '',
    progress: 0,
    completed: false,
  });

  // 9. Environmental Telemetry (updates based on activeHorizon)
  const environment = useMemo(() => {
    return environmentService.getCurrentConditions(activeHorizon);
  }, [activeHorizon]);

  // 10. Spill Prediction State (coordinates, area, distance, landfall)
  const currentPrediction = useMemo(() => {
    return spillPredictionService.getPredictionByHorizon(activeHorizon);
  }, [activeHorizon]);

  // Selected candidate vessel
  const selectedVessel = useMemo(() => {
    return vessels.find(v => v.id.toLowerCase() === selectedVesselId.toLowerCase()) || vessels[0];
  }, [vessels, selectedVesselId]);

  // Set horizon and align timeline scrubber
  const setHorizon = useCallback((horizonKey) => {
    setActiveHorizon(horizonKey);
    const horizonHoursMap = { '0H': 0, '6H': 8.3, '12H': 16.6, '24H': 33.3, '48H': 66.6, '72H': 100 };
    if (horizonHoursMap[horizonKey] !== undefined) {
      setTimelineProgressState(horizonHoursMap[horizonKey]);
    }
  }, []);

  // Set timeline progress (0 to 100) and snap or interpolate activeHorizon
  const setTimelineProgress = useCallback((val) => {
    setTimelineProgressState(val);
    if (val < 5) setActiveHorizon('0H');
    else if (val < 13) setActiveHorizon('6H');
    else if (val < 25) setActiveHorizon('12H');
    else if (val < 50) setActiveHorizon('24H');
    else if (val < 85) setActiveHorizon('48H');
    else setActiveHorizon('72H');
  }, []);

  // Auto-play loop for timeline
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineProgressState(prev => {
          const next = prev + 1.25;
          if (next >= 100) {
            setIsPlaying(false);
            return 100;
          }
          if (next < 5) setActiveHorizon('0H');
          else if (next < 13) setActiveHorizon('6H');
          else if (next < 25) setActiveHorizon('12H');
          else if (next < 50) setActiveHorizon('24H');
          else if (next < 85) setActiveHorizon('48H');
          else setActiveHorizon('72H');
          return next;
        });
      }, 180);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Focus on specific coordinates on the 3D globe / map
  const focusOnCoordinates = useCallback((lat, lng, zoomLevel = null) => {
    setCameraFocusTarget({ lat, lng, zoomLevel, timestamp: Date.now() });
  }, []);

  // Reset camera to default incident origin
  const resetCamera = useCallback(() => {
    setCameraFocusTarget({
      lat: currentIncident.coordinates.lat,
      lng: currentIncident.coordinates.lng,
      timestamp: Date.now(),
    });
    setResetCameraCounter(c => c + 1);
    addToast('Camera reset to Incident Origin (Sector 4B)', 'info');
  }, [currentIncident, addToast]);

  // Open entity details
  const openEntityModal = useCallback((type, data) => {
    setSelectedEntity({ type, data });
    if (type === 'SPILL' || type === 'OIL_SPILL') {
      setActiveModal('SPILL_INFO');
    } else if (type === 'VESSEL') {
      if (data?.id) setSelectedVesselId(data.id);
      setActiveModal('VESSEL_INFO');
    } else if (type === 'ECOSYSTEM' || type === 'CORAL' || type === 'FISHERY') {
      setActiveModal('ECOSYSTEM_INFO');
    } else if (type === 'SATELLITE' || type === 'SAR') {
      setActiveModal('SATELLITE_INFO');
    } else if (type === 'RISK_ZONE') {
      setActiveModal('RISK_ZONES');
    } else {
      setActiveModal('SPILL_INFO');
    }
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setSelectedEntity(null);
  }, []);

  // Run the 9-step operational incident simulation
  const runIncidentSimulation = useCallback(() => {
    setSimulationState({
      isRunning: true,
      step: 1,
      totalSteps: 9,
      title: 'Satellite Ingestion Commenced',
      message: 'Analyzing Sentinel-1 SAR imagery...',
      subtext: 'Ingesting ESA Copernicus C-SAR radar backscatter swath...',
      progress: 11,
      completed: false,
    });

    addToast('Running Incident Simulation Pipeline...', 'warning');

    simulationService.runSimulation({
      onStepProgress: ({ step, totalSteps, title, message, subtext, progress }) => {
        setSimulationState({
          isRunning: true,
          step,
          totalSteps,
          title,
          message,
          subtext,
          progress,
          completed: false,
        });

        // Intermediate dashboard state updates
        if (step === 2) {
          addToast('Step 2: Oil spill detected at 61.4200° N, 04.1800° E', 'critical');
        } else if (step === 4) {
          setSelectedVesselId('solara');
          addToast('Step 4: MV Solara identified with 91% correlation', 'warning');
        } else if (step === 6) {
          setHorizon('24H');
        } else if (step === 7) {
          setHorizon('48H');
        }
      },
      onComplete: () => {
        setSimulationState(prev => ({
          ...prev,
          isRunning: false,
          progress: 100,
          completed: true,
          title: 'Simulation Complete',
          message: 'Final incident report generated.',
          subtext: 'Comprehensive forensic dossier compiled and ready for review.',
        }));
        addToast('Incident Simulation Complete. Final Dossier Generated.', 'success');
      },
    });
  }, [addToast, setHorizon]);

  // Global search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const performSearch = useCallback((rawQuery) => {
    if (!rawQuery || !rawQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const q = rawQuery.trim().toLowerCase();

    // 1. Check Incident ID
    if (q.includes('inc') || q.includes('0906') || q.includes('ms-2026')) {
      focusOnCoordinates(currentIncident.coordinates.lat, currentIncident.coordinates.lng);
      openEntityModal('SPILL', currentIncident);
      addToast(`Found Incident #${currentIncident.id}`, 'info');
      setSearchResults({ type: 'INCIDENT', item: currentIncident });
      return;
    }

    // 2. Check coordinate regex (e.g. 61.42, 4.18)
    const coordMatch = q.match(/([0-9]+\.?[0-9]*)\s*,\s*([0-9]+\.?[0-9]*)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        focusOnCoordinates(lat, lng);
        addToast(`Centered camera on coordinates: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`, 'info');
        setSearchResults({ type: 'COORDINATES', item: { lat, lng } });
        return;
      }
    }

    // 3. Search Vessels
    const matchedVessels = vesselService.searchVessels(q);
    if (matchedVessels.length > 0) {
      const topMatch = matchedVessels[0];
      setSelectedVesselId(topMatch.id);
      focusOnCoordinates(topMatch.coordinates.lat, topMatch.coordinates.lng);
      openEntityModal('VESSEL', topMatch);
      addToast(`Found vessel: ${topMatch.name} (${topMatch.type})`, 'info');
      setSearchResults({ type: 'VESSEL', item: topMatch, allMatches: matchedVessels });
      return;
    }

    addToast(`No matches found for "${rawQuery}"`, 'warning');
    setSearchResults(null);
  }, [currentIncident, focusOnCoordinates, openEntityModal, addToast]);

  const value = {
    // Incident
    incidents,
    currentIncident,
    setCurrentIncident,
    // Vessels
    vessels,
    selectedVesselId,
    setSelectedVesselId,
    selectedVessel,
    vesselFilter,
    setVesselFilter,
    // Horizons & Timeline
    activeHorizon,
    setHorizon,
    timelineProgress,
    setTimelineProgress,
    isPlaying,
    setIsPlaying,
    togglePlay: () => setIsPlaying(p => !p),
    // Physics & Environment
    environment,
    currentPrediction,
    protectedAreas: protectedAreasData,
    // Layers
    layers,
    toggleLayer,
    // Simulation
    simulationState,
    runIncidentSimulation,
    stopSimulation: () => simulationService.cancel(),
    // Modals & Interactive Objects
    activeModal,
    setActiveModal,
    selectedEntity,
    openEntityModal,
    closeModal,
    // Camera Focus
    cameraFocusTarget,
    focusOnCoordinates,
    resetCamera,
    resetCameraCounter,
    // Search
    searchQuery,
    setSearchQuery,
    searchResults,
    performSearch,
    // Toasts
    toasts,
    addToast,
    dismissToast,
    // Navigation helper
    onNavigate,
    currentView,
  };

  return (
    <MaritimeContext.Provider value={value}>
      {children}
    </MaritimeContext.Provider>
  );
}

export function useMaritime() {
  const context = useContext(MaritimeContext);
  if (!context) {
    throw new Error('useMaritime must be used within a MaritimeProvider');
  }
  return context;
}
