import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Compass, 
  RotateCcw, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Crosshair, 
  ZoomIn, 
  ZoomOut,
  Sparkles,
  Camera,
  Radio,
  AlertTriangle,
  Ship,
  Droplet,
  Satellite,
  Activity,
  Fish,
  Trees,
  Navigation,
  Wind,
  Waves,
  ShieldAlert,
  Target
} from 'lucide-react';
import { useMaritime } from '../../context/MaritimeContext';
import { 
  INCIDENT_PROFILE, 
  PREDICTION_TIMELINE, 
  CANDIDATE_VESSELS, 
  ECOSYSTEM_ZONES, 
  RISK_ZONES 
} from '../../data/simulationData';

const GLOBE_RADIUS = 100;

// Convert lat/lng to 3D Cartesian coordinates on sphere
function latLngToVector3(lat, lng, radius = GLOBE_RADIUS, altOffset = 0) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const r = radius + altOffset;
  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = r * Math.sin(phi) * Math.sin(theta);
  const y = r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Convert 3D Cartesian point on sphere back to Lat/Lng
function vector3ToLatLng(vector, radius = GLOBE_RADIUS) {
  const norm = vector.clone().normalize();
  const phi = Math.acos(Math.max(-1, Math.min(1, norm.y)));
  const theta = Math.atan2(norm.z, -norm.x);
  const lat = 90 - (phi * 180 / Math.PI);
  let lng = (theta * 180 / Math.PI) - 180;
  while (lng < -180) lng += 360;
  while (lng > 180) lng -= 360;
  return { lat, lng };
}

export default function OceanGlobe3D({
  currentHorizon: propHorizon = null,
  selectedEntity: propSelectedEntity = null,
  onSelectEntity: propOnSelectEntity = null,
  layerVisibility: propLayers = null,
  onToggleLayer: propOnToggleLayer = null,
  isFullScreen = false,
  onToggleFullScreen = null,
}) {
  const context = useMaritime();

  // Resolved context or prop state
  const activeHorizon = propHorizon || context?.activeHorizon || '0H';
  const currentIncident = context?.currentIncident || INCIDENT_PROFILE;
  const environment = context?.environment;
  const openEntityModal = context?.openEntityModal || propOnSelectEntity;
  const focusTarget = context?.cameraFocusTarget;

  const layers = propLayers || context?.layers || {
    satelliteSar: true,
    aisVessels: true,
    oilSpill: true,
    drift24h: true,
    drift48h: true,
    protectedAreas: true,
    coralEcosystem: true,
    riskZones: true,
    threatArcs: true,
    currentsFlow: true,
    coastline: true,
    chartGrid: true,
    aisTracks: true,
  };

  const toggleLayer = propOnToggleLayer || context?.toggleLayer;

  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const globeGroupRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Satellite reference for animation & tracking
  const satelliteMeshRef = useRef(null);

  // Screen-projected 3D HUD badges state
  const [hudBadges, setHudBadges] = useState([]);
  const [activePoi, setActivePoi] = useState('incident');

  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [cursorCoords, setCursorCoords] = useState({ lat: 61.42, lng: 4.18, depth: 285, temp: 11.4 });
  const [cameraCoords, setCameraCoords] = useState({ lat: 61.4, lng: 4.2, altKm: 220 });
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Active prediction index for expansion sizing
  const horizonIndex = PREDICTION_TIMELINE.findIndex(p => p.horizonKey === activeHorizon);
  const activeForecast = PREDICTION_TIMELINE[horizonIndex >= 0 ? horizonIndex : 0];

  // Camera lerp target ref for smooth transitions
  const cameraLerpTargetRef = useRef(null);

  // Smoothly move camera towards target coordinates
  const triggerCameraFocus = useCallback((lat, lng, distance = 200, poiKey = null) => {
    if (!cameraRef.current) return;
    if (poiKey) setActivePoi(poiKey);
    const targetPos = latLngToVector3(lat, lng, GLOBE_RADIUS);
    const cameraPos = targetPos.clone().normalize().multiplyScalar(distance);
    cameraLerpTargetRef.current = {
      position: cameraPos,
      lookAt: targetPos,
      progress: 0,
    };
  }, []);

  // Listen to focusTarget changes from context
  useEffect(() => {
    if (focusTarget && typeof focusTarget.lat === 'number') {
      triggerCameraFocus(focusTarget.lat, focusTarget.lng, focusTarget.zoomLevel || 200);
    }
  }, [focusTarget, triggerCameraFocus]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 3500);
    cameraRef.current = camera;

    // Initial camera position pointing towards Sector 4B
    const initialTarget = latLngToVector3(61.42, 4.18, GLOBE_RADIUS);
    const initialCamPos = initialTarget.clone().normalize().multiplyScalar(220);
    camera.position.copy(initialCamPos);
    camera.lookAt(initialTarget);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      preserveDrawingBuffer: true,
      powerPreference: "high-performance" 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 2. Dynamic Lighting ---
    const ambientLight = new THREE.AmbientLight(0x1e293b, 2.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xe0f2fe, 2.8);
    sunLight.position.set(300, 220, 260);
    scene.add(sunLight);

    const cyanRimLight = new THREE.DirectionalLight(0x0ea5e9, 1.8);
    cyanRimLight.position.set(-300, -120, -260);
    scene.add(cyanRimLight);

    const backScatterLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    backScatterLight.position.set(0, 300, -100);
    scene.add(backScatterLight);

    // --- 3. Earth Globe Group & Enhanced High-Res Texture ---
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // High resolution Canvas for Earth oceans and continental vectors
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep bathymetric navy ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#020617');
    oceanGrad.addColorStop(0.25, '#051329');
    oceanGrad.addColorStop(0.5, '#081c3b');
    oceanGrad.addColorStop(0.75, '#051329');
    oceanGrad.addColorStop(1, '#020617');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Graticule grid lines on ocean texture
    if (layers.chartGrid !== false) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = 1;
      for (let lat = -80; lat <= 80; lat += 20) {
        const y = ((90 - lat) / 180) * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      for (let lng = -180; lng <= 180; lng += 30) {
        const x = ((lng + 180) / 360) * canvas.width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Equator and Prime Meridian accentuation
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.28)';
      ctx.lineWidth = 1.5;
      const eqY = (90 / 180) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, eqY);
      ctx.lineTo(canvas.width, eqY);
      ctx.stroke();
      const pmX = (180 / 360) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(pmX, 0);
      ctx.lineTo(pmX, canvas.height);
      ctx.stroke();
    }

    // High detail continental coastlines with glowing cyan contours
    if (layers.coastline !== false) {
      ctx.fillStyle = '#0a1424';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.6;

      const drawPoly = (pts, glow = true) => {
        ctx.save();
        if (glow) {
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 6;
        }
        ctx.beginPath();
        pts.forEach((p, idx) => {
          const x = ((p[1] + 180) / 360) * canvas.width;
          const y = ((90 - p[0]) / 180) * canvas.height;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      };

      // Norway & Scandinavian Mainland
      drawPoly([[58, 6], [60.5, 5], [62.2, 5.2], [64, 10], [67, 14], [70, 25], [71.2, 28], [70.5, 31], [65, 22], [59, 18], [56, 12], [58, 6]]);
      // UK Main & Scotland
      drawPoly([[50, -5], [52, -3], [54, -3], [56, -5], [58.5, -5], [58.5, -2], [55, -1], [53, 0], [51, 1], [50, -5]]);
      // Ireland
      drawPoly([[51.5, -10], [53.5, -10], [55.2, -8], [55, -6], [52.2, -6], [51.5, -10]]);
      // Denmark, Baltic & Continental Western Europe
      drawPoly([[54.5, 8], [57.5, 10], [55.5, 12], [54, 19], [48, 17], [44, -1], [48, -4], [51, 2], [54, 8]]);
      // Iceland
      drawPoly([[63.5, -24], [66.5, -22], [66, -14], [64, -14], [63.5, -24]]);
      // Svalbard Archipelago
      drawPoly([[76, 15], [80, 16], [80, 28], [76, 25], [76, 15]]);
      // Shetland & Orkney Islands
      drawPoly([[60.1, -1.2], [60.8, -0.8], [60.5, -1.5], [60.1, -1.2]]);
      drawPoly([[58.9, -3.2], [59.3, -2.8], [59.0, -3.4], [58.9, -3.2]]);
      // Faroe Islands
      drawPoly([[61.8, -6.9], [62.4, -6.6], [62.2, -7.2], [61.8, -6.9]]);
    }

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.72,
      metalness: 0.18,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Glowing cyan atmospheric Fresnel envelope
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.032, 64, 48);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.14, 0.75, 0.98, 1.0) * intensity * 0.85;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // --- 4. Clickable Interactive Entities Group ---
    const entitiesGroup = new THREE.Group();
    globeGroup.add(entitiesGroup);
    const interactiveMeshes = [];
    const dynamicAnimObjects = [];

    // Track 3D world positions of key anchors for HTML HUD overlays
    const trackedBadgesRef = {
      spill: null,
      vessel: null,
      coral: null,
      satellite: null,
    };

    // (A) Orbiting 3D Sentinel-1 SAR Satellite with Sweeping Radar Cone
    let satelliteOrbitAngle = 0.45;
    let satelliteGroup = null;
    let radarConeMesh = null;
    let groundSwathMesh = null;

    if (layers.satelliteSar !== false) {
      satelliteGroup = new THREE.Group();
      entitiesGroup.add(satelliteGroup);

      // Satellite Bus (Golden & Metallic Box)
      const busGeo = new THREE.BoxGeometry(2.2, 1.4, 1.6);
      const busMat = new THREE.MeshStandardMaterial({
        color: 0xd97706, // Gold foil thermal blanket
        metalness: 0.85,
        roughness: 0.25,
      });
      const busMesh = new THREE.Mesh(busGeo, busMat);
      satelliteGroup.add(busMesh);

      // Solar Panel Wings (Photovoltaic blue)
      const solarMat = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x1e40af,
        emissiveIntensity: 0.2,
      });
      const leftWingGeo = new THREE.BoxGeometry(5.2, 0.08, 1.4);
      const leftWing = new THREE.Mesh(leftWingGeo, solarMat);
      leftWing.position.set(-3.7, 0, 0);
      satelliteGroup.add(leftWing);

      const rightWing = new THREE.Mesh(leftWingGeo, solarMat);
      rightWing.position.set(3.7, 0, 0);
      satelliteGroup.add(rightWing);

      // Radar Boom / Antenna Mast
      const boomGeo = new THREE.BoxGeometry(0.3, 1.8, 0.3);
      const boomMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6, roughness: 0.4 });
      const boomMesh = new THREE.Mesh(boomGeo, boomMat);
      boomMesh.position.set(0, -1.2, 0);
      satelliteGroup.add(boomMesh);

      // C-SAR Instrument Antenna Dish
      const dishGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.15, 24);
      const dishMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.5, roughness: 0.3 });
      const dishMesh = new THREE.Mesh(dishGeo, dishMat);
      dishMesh.position.set(0, -2.1, 0);
      dishMesh.rotateX(Math.PI / 2);
      satelliteGroup.add(dishMesh);

      // Sweeping Translucent Radar Beam Cone towards Earth
      const coneHeight = 45;
      const coneGeo = new THREE.ConeGeometry(12, coneHeight, 32, 1, true);
      coneGeo.translate(0, -coneHeight / 2, 0);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      radarConeMesh = new THREE.Mesh(coneGeo, coneMat);
      radarConeMesh.position.set(0, -2.2, 0);
      satelliteGroup.add(radarConeMesh);

      // Ground radar swath footprint on sea surface
      const swathGeo = new THREE.RingGeometry(10, 12, 32);
      const swathMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      groundSwathMesh = new THREE.Mesh(swathGeo, swathMat);
      entitiesGroup.add(groundSwathMesh);

      // Make satellite clickable
      busMesh.userData = {
        type: 'SATELLITE',
        title: 'Sentinel-1A C-SAR (Copernicus)',
        details: 'Orbit: Sun-Synchronous (693km) · C-Band (5.405 GHz) · IW Mode Swath: 250km · Resolution: 5x20m',
        data: {
          satellite: 'Sentinel-1A',
          passId: 'S1A_IW_GRDH_1SDV_20260906T074211',
          frequency: '5.405 GHz',
          mode: 'Interferometric Wide (IW)',
          swathWidthKm: 250,
        }
      };
      interactiveMeshes.push(busMesh);
      satelliteMeshRef.current = satelliteGroup;
    }

    // (B) Oil Spill Slick Layer (Interactive with Spreading, Iridescent Rings & Hazard Beacon)
    if (layers.oilSpill !== false) {
      const currentSpillLat = activeForecast.coordinates?.lat || 61.42;
      const currentSpillLng = activeForecast.coordinates?.lng || 4.18;
      const spillPos = latLngToVector3(currentSpillLat, currentSpillLng, GLOBE_RADIUS, 0.4);
      trackedBadgesRef.spill = spillPos;

      const scaleMultiplier = activeForecast.polygonScale || (0.8 + horizonIndex * 0.35);
      const baseSlickRadius = 3.6 * scaleMultiplier;

      // Hydrocarbon Dark Slick Core Mesh
      const slickGeo = new THREE.CircleGeometry(baseSlickRadius, 48);
      const slickMat = new THREE.MeshBasicMaterial({
        color: 0x080f1e,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
      });
      const slickMesh = new THREE.Mesh(slickGeo, slickMat);
      slickMesh.position.copy(spillPos);
      slickMesh.lookAt(spillPos.clone().multiplyScalar(2));
      
      slickMesh.userData = {
        type: 'SPILL',
        title: `Active Oil Spill · ${currentIncident.id || 'MS-2026-001'}`,
        details: `Area: ${activeForecast.slickAreaKm2} km² · Confidence: 94% · Coastal Threat: ${activeForecast.coastalDistanceNM} NM`,
        data: {
          ...currentIncident,
          currentAreaKm2: activeForecast.slickAreaKm2,
          currentCoordinates: { lat: currentSpillLat, lng: currentSpillLng },
          coastalDistanceNM: activeForecast.coastalDistanceNM,
        }
      };
      entitiesGroup.add(slickMesh);
      interactiveMeshes.push(slickMesh);

      // Iridescent Oil Sheen Edge Ring (subtle rainbow sheen)
      const sheenGeo = new THREE.RingGeometry(baseSlickRadius * 0.95, baseSlickRadius * 1.15, 48);
      const sheenMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const sheenMesh = new THREE.Mesh(sheenGeo, sheenMat);
      sheenMesh.position.copy(spillPos);
      sheenMesh.lookAt(spillPos.clone().multiplyScalar(2));
      entitiesGroup.add(sheenMesh);

      // 3 Concentric Dynamic Threat Rings
      const ringConfigs = [
        { mult: 1.35, color: 0xef4444, opacity: 0.85, label: 'HIGH RISK (0-8 NM)' },
        { mult: 1.85, color: 0xf97316, opacity: 0.65, label: 'MEDIUM RISK (8-16 NM)' },
        { mult: 2.50, color: 0xeab308, opacity: 0.40, label: 'LOW RISK (16-28 NM)' },
      ];

      ringConfigs.forEach(rc => {
        const ringGeo = new THREE.RingGeometry(baseSlickRadius * rc.mult, baseSlickRadius * (rc.mult + 0.12), 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: rc.color,
          transparent: true,
          opacity: rc.opacity,
          side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(spillPos);
        ringMesh.lookAt(spillPos.clone().multiplyScalar(2));
        entitiesGroup.add(ringMesh);

        dynamicAnimObjects.push({
          mesh: ringMesh,
          pulseSpeed: 0.003 + rc.mult * 0.001,
          type: 'PULSE_RING'
        });
      });

      // Warning Strobe Beacon at Spill Epicenter
      const beaconGeo = new THREE.SphereGeometry(0.9, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.copy(spillPos.clone().multiplyScalar(1.018));
      entitiesGroup.add(beaconMesh);
      dynamicAnimObjects.push({ mesh: beaconMesh, pulseSpeed: 0.08, type: 'BEACON' });
    }

    // (C) 3D Curved Threat Projection Arcs (Parabolic Trajectories to Corals & Fisheries)
    if (layers.threatArcs !== false) {
      const spillLat = activeForecast.coordinates?.lat || 61.42;
      const spillLng = activeForecast.coordinates?.lng || 4.18;
      const startV = latLngToVector3(spillLat, spillLng, GLOBE_RADIUS, 0.4);

      ECOSYSTEM_ZONES.forEach(eco => {
        const endV = latLngToVector3(eco.coordinates.lat, eco.coordinates.lng, GLOBE_RADIUS, 0.4);
        
        // Midpoint elevated above globe radius for high parabolic curvature
        const midV = startV.clone().add(endV).multiplyScalar(0.5);
        const arcElevation = 1.08; // 8% above surface
        midV.normalize().multiplyScalar(GLOBE_RADIUS * arcElevation);

        const curve = new THREE.QuadraticBezierCurve3(startV, midV, endV);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.22, 6, false);
        const isCritical = eco.vulnerabilityLevel === 'CRITICAL';
        const tubeMat = new THREE.MeshBasicMaterial({
          color: isCritical ? 0xef4444 : 0xf59e0b,
          transparent: true,
          opacity: 0.65,
        });
        const arcMesh = new THREE.Mesh(tubeGeo, tubeMat);
        entitiesGroup.add(arcMesh);

        // Animated traveling photon bead along the arc
        const beadGeo = new THREE.SphereGeometry(0.65, 12, 12);
        const beadMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const beadMesh = new THREE.Mesh(beadGeo, beadMat);
        entitiesGroup.add(beadMesh);

        dynamicAnimObjects.push({
          mesh: beadMesh,
          curve: curve,
          progress: Math.random(),
          speed: 0.008,
          type: 'ARC_PHOTON'
        });
      });
    }

    // (D) Predicted 24h & 48h Drift Waypoints & Trajectory Tube
    if (layers.drift24h !== false || layers.drift48h !== false) {
      const trajWaypoints = PREDICTION_TIMELINE.filter(p => {
        if (!layers.drift48h && p.hours > 24) return false;
        return true;
      });

      const trajPoints = trajWaypoints.map(p => 
        latLngToVector3(p.coordinates.lat, p.coordinates.lng, GLOBE_RADIUS, 0.45)
      );

      if (trajPoints.length >= 2) {
        const curve = new THREE.CatmullRomCurve3(trajPoints);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.35, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.85,
        });
        const trajectoryMesh = new THREE.Mesh(tubeGeo, tubeMat);
        trajectoryMesh.userData = {
          type: 'TRAJECTORY',
          title: `Hydrodynamic Drift Trajectory (0-72h)`,
          details: `Heading: 052° NE · Landfall risk: ${activeForecast.landfallProbability}% at 68h`,
          data: PREDICTION_TIMELINE,
        };
        entitiesGroup.add(trajectoryMesh);
        interactiveMeshes.push(trajectoryMesh);

        // Waypoint Cones
        trajWaypoints.forEach(wp => {
          const wpPos = latLngToVector3(wp.coordinates.lat, wp.coordinates.lng, GLOBE_RADIUS, 0.55);
          const pinGeo = new THREE.ConeGeometry(0.65, 1.6, 16);
          pinGeo.rotateX(Math.PI);
          const isCurrentWp = wp.horizonKey === activeHorizon;
          const pinMat = new THREE.MeshStandardMaterial({
            color: isCurrentWp ? 0xffffff : (wp.hours >= 48 ? 0xef4444 : 0x38bdf8),
            emissive: isCurrentWp ? 0x38bdf8 : 0x000000,
            emissiveIntensity: 0.8,
          });
          const pinMesh = new THREE.Mesh(pinGeo, pinMat);
          pinMesh.position.copy(wpPos);
          pinMesh.lookAt(wpPos.clone().multiplyScalar(2));
          pinMesh.userData = {
            type: 'WAYPOINT',
            title: `Forecast Horizon: ${wp.label}`,
            details: `Area: ${wp.slickAreaKm2} km² · Shoreline: ${wp.coastalDistanceNM} NM · Landfall: ${wp.landfallProbability}%`,
            data: wp,
          };
          entitiesGroup.add(pinMesh);
          interactiveMeshes.push(pinMesh);
        });
      }
    }

    // (E) AIS Fleet Vessels (Detailed 3D Models with Movement Trails)
    if (layers.aisVessels !== false) {
      CANDIDATE_VESSELS.forEach(v => {
        const parts = (v.lastKnownPosition || "61.58, 4.38").replace('° N', '').replace('° E', '').split(',');
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (isNaN(lat) || isNaN(lng)) return;

        const vPos = latLngToVector3(lat, lng, GLOBE_RADIUS, 0.55);
        const vGroup = new THREE.Group();
        vGroup.position.copy(vPos);

        const isSolara = v.id === 'solara';
        if (isSolara) {
          trackedBadgesRef.vessel = vPos;

          // 3D Tanker Model for Suspect
          const lowerHullGeo = new THREE.BoxGeometry(1.4, 0.5, 3.8);
          const lowerHullMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.3, roughness: 0.5 });
          const lowerHull = new THREE.Mesh(lowerHullGeo, lowerHullMat);
          vGroup.add(lowerHull);

          const deckGeo = new THREE.BoxGeometry(1.1, 0.3, 3.6);
          const deckMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.4 });
          const deckMesh = new THREE.Mesh(deckGeo, deckMat);
          deckMesh.position.set(0, 0.3, 0);
          vGroup.add(deckMesh);

          const bridgeGeo = new THREE.BoxGeometry(0.95, 0.8, 1.0);
          const bridgeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
          const bridgeMesh = new THREE.Mesh(bridgeGeo, bridgeMat);
          bridgeMesh.position.set(0, 0.7, -1.1);
          vGroup.add(bridgeMesh);

          // Funnel
          const funnelGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.5, 12);
          const funnelMesh = new THREE.Mesh(funnelGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
          funnelMesh.position.set(0, 1.15, -1.3);
          vGroup.add(funnelMesh);

          // Warning Aura Ring
          const auraGeo = new THREE.RingGeometry(2.6, 3.0, 32);
          const auraMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
          const auraMesh = new THREE.Mesh(auraGeo, auraMat);
          auraMesh.rotateX(Math.PI / 2);
          vGroup.add(auraMesh);

          const vesselData = {
            type: 'VESSEL',
            title: `MV Solara (Crude Tanker) · 91% Match`,
            details: `IMO: 9384721 · MMSI: 419824190 · Speed: 17.4 kt · Gap: 2h 00m · Primary Suspect`,
            data: v,
          };
          lowerHull.userData = vesselData;
          bridgeMesh.userData = vesselData;
          deckMesh.userData = vesselData;
          interactiveMeshes.push(lowerHull, bridgeMesh, deckMesh);

        } else {
          // Standard Commercial Vessel Model
          const hullGeo = new THREE.BoxGeometry(0.9, 0.45, 2.2);
          const hullColor = v.statusBadge === 'amber' ? 0xf59e0b : (v.statusBadge === 'blue' ? 0x38bdf8 : 0x10b981);
          const hullMesh = new THREE.Mesh(hullGeo, new THREE.MeshStandardMaterial({ color: hullColor, metalness: 0.4, roughness: 0.4 }));
          vGroup.add(hullMesh);

          const arrowGeo = new THREE.ConeGeometry(0.4, 0.9, 12);
          arrowGeo.rotateX(Math.PI / 2);
          const arrowMesh = new THREE.Mesh(arrowGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
          arrowMesh.position.set(0, 0.35, 1.3);
          vGroup.add(arrowMesh);

          hullMesh.userData = {
            type: 'VESSEL',
            title: `${v.name} (${v.type})`,
            details: `IMO: ${v.imo} · MMSI: ${v.mmsi} · Speed: ${v.currentSpeedKnots} kt · Score: ${v.correlationScore || 12}%`,
            data: v,
          };
          interactiveMeshes.push(hullMesh);
        }

        vGroup.lookAt(vPos.clone().multiplyScalar(2));
        vGroup.rotateZ(THREE.MathUtils.degToRad(-(v.currentHeadingDeg || 42)));
        entitiesGroup.add(vGroup);

        // Movement trails
        if (layers.aisTracks !== false && v.historicalTrack && v.historicalTrack.length > 1) {
          const trackPts = v.historicalTrack.map(tp => latLngToVector3(tp.lat, tp.lng, GLOBE_RADIUS, 0.28));
          const lineGeo = new THREE.BufferGeometry().setFromPoints(trackPts);
          const lineMat = new THREE.LineDashedMaterial({
            color: isSolara ? 0xef4444 : 0x64748b,
            dashSize: 1,
            gapSize: 0.5,
            linewidth: 1.5,
          });
          const trackLine = new THREE.Line(lineGeo, lineMat);
          trackLine.computeLineDistances();
          entitiesGroup.add(trackLine);
        }
      });
    }

    // (F) Coral Bioherm & Marine Protected Area Markers
    if (layers.coralEcosystem !== false || layers.protectedAreas !== false) {
      ECOSYSTEM_ZONES.forEach((eco, idx) => {
        const ecoPos = latLngToVector3(eco.coordinates.lat, eco.coordinates.lng, GLOBE_RADIUS, 0.45);
        if (idx === 0) trackedBadgesRef.coral = ecoPos;

        const ecoGeo = new THREE.OctahedronGeometry(1.3, 0);
        const ecoColor = eco.riskColor === '#ef4444' ? 0xef4444 : (eco.riskColor === '#f97316' ? 0xf97316 : 0x10b981);
        const ecoMat = new THREE.MeshStandardMaterial({
          color: ecoColor,
          metalness: 0.3,
          roughness: 0.4,
          emissive: ecoColor,
          emissiveIntensity: 0.3,
        });
        const ecoMesh = new THREE.Mesh(ecoGeo, ecoMat);
        ecoMesh.position.copy(ecoPos);
        ecoMesh.userData = {
          type: 'ECOSYSTEM',
          title: eco.name,
          details: `${eco.category} · Threat: ${eco.vulnerabilityLevel} · Time to Impact: ${eco.timeToPotentialExposureHours}h`,
          data: eco,
        };
        entitiesGroup.add(ecoMesh);
        interactiveMeshes.push(ecoMesh);

        // Ecosystem Boundary Ring
        const ringGeo = new THREE.RingGeometry(1.6, 2.2, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: ecoColor, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(ecoPos);
        ringMesh.lookAt(ecoPos.clone().multiplyScalar(2));
        entitiesGroup.add(ringMesh);
      });
    }

    // (G) Dynamic Hydrodynamic Ocean Current Particles (Flow field along Norwegian Coastal Current)
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVels = [];

    for (let i = 0; i < particleCount; i++) {
      const lat = 59.5 + Math.random() * 3.5;
      const lng = 2.0 + Math.random() * 4.5;
      const p = latLngToVector3(lat, lng, GLOBE_RADIUS, 0.35);
      particlePositions[i * 3] = p.x;
      particlePositions[i * 3 + 1] = p.y;
      particlePositions[i * 3 + 2] = p.z;
      particleVels.push({
        lat,
        lng,
        speed: 0.02 + Math.random() * 0.025,
      });
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    if (layers.currentsFlow !== false) {
      globeGroup.add(particles);
    }

    // --- 5. Mouse Orbit, Drag, Zoom & Double-Click Navigation ---
    let isDragging = false;
    let startMouseX = 0;
    let startMouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onMouseDown = (e) => {
      if (e.button === 0) {
        isDragging = true;
        startMouseX = e.clientX;
        startMouseY = e.clientY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;

        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
        globeGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroup.rotation.x));

        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        raycaster.setFromCamera(mouseVector, camera);
        
        // 1. Check Globe surface for real-time cursor Lat/Lng coordinates
        const globeIntersects = raycaster.intersectObject(globeMesh, false);
        if (globeIntersects.length > 0) {
          const hitPoint = globeIntersects[0].point.clone().applyMatrix4(globeGroup.matrixWorld.clone().invert());
          const coords = vector3ToLatLng(hitPoint, GLOBE_RADIUS);
          const simulatedDepth = coords.lng > 4.5 ? Math.round(120 + Math.abs(coords.lat - 61) * 30) : 285;
          setCursorCoords({
            lat: Number(coords.lat.toFixed(4)),
            lng: Number(coords.lng.toFixed(4)),
            depth: simulatedDepth,
            temp: 11.4,
          });
        }

        // 2. Check Interactive Meshes for Hover Card
        const entityIntersects = raycaster.intersectObjects(interactiveMeshes, false);
        if (entityIntersects.length > 0) {
          const hovered = entityIntersects[0].object.userData;
          setHoveredEntity(hovered);
          container.style.cursor = 'pointer';
        } else {
          setHoveredEntity(null);
          container.style.cursor = 'grab';
        }
      }
    };

    const onMouseUp = (e) => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.18;
      const newDistance = THREE.MathUtils.clamp(camera.position.length() + zoomFactor, 120, 480);
      camera.position.setLength(newDistance);
    };

    // Click handler with drag threshold protection
    const onClick = (e) => {
      const dragDist = Math.hypot(e.clientX - startMouseX, e.clientY - startMouseY);
      if (dragDist > 6) return; // Ignore drag motions

      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);

      if (intersects.length > 0) {
        const targetData = intersects[0].object.userData;
        if (openEntityModal) {
          openEntityModal(targetData.type, targetData.data);
        }
      }
    };

    const onDoubleClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const globeIntersects = raycaster.intersectObject(globeMesh, false);

      if (globeIntersects.length > 0) {
        const hitPoint = globeIntersects[0].point.clone().applyMatrix4(globeGroup.matrixWorld.clone().invert());
        const coords = vector3ToLatLng(hitPoint, GLOBE_RADIUS);
        triggerCameraFocus(coords.lat, coords.lng, 180);
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });
    domElem.addEventListener('click', onClick);
    domElem.addEventListener('dblclick', onDoubleClick);

    // --- 6. Resize Observer ---
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // --- 7. Animation Loop ---
    let frame = 0;
    const animate = () => {
      frame++;
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Auto-rotation toggle
      if (isAutoRotating) {
        globeGroup.rotation.y += 0.0012;
      }

      // Smooth camera lerping on focus target
      if (cameraLerpTargetRef.current) {
        const target = cameraLerpTargetRef.current;
        camera.position.lerp(target.position, 0.05);
        camera.lookAt(target.lookAt);
        target.progress += 0.05;
        if (target.progress >= 1.0 || camera.position.distanceTo(target.position) < 1.0) {
          cameraLerpTargetRef.current = null;
        }
      }

      // Orbit Satellite in Sun-Synchronous Orbit
      if (satelliteGroup) {
        satelliteOrbitAngle += 0.003;
        const orbitRadius = GLOBE_RADIUS * 1.55;
        const satLat = Math.sin(satelliteOrbitAngle) * 75; // 75° inclination range
        const satLng = 4.18 + Math.cos(satelliteOrbitAngle) * 25;
        const satWorldPos = latLngToVector3(satLat, satLng, orbitRadius);
        satelliteGroup.position.copy(satWorldPos);
        satelliteGroup.lookAt(latLngToVector3(satLat, satLng, GLOBE_RADIUS));

        if (groundSwathMesh) {
          const groundPos = latLngToVector3(satLat, satLng, GLOBE_RADIUS, 0.3);
          groundSwathMesh.position.copy(groundPos);
          groundSwathMesh.lookAt(groundPos.clone().multiplyScalar(2));
        }

        trackedBadgesRef.satellite = satWorldPos;
      }

      // Update real-time camera coordinates readout
      if (frame % 10 === 0) {
        const camCoords = vector3ToLatLng(camera.position, GLOBE_RADIUS);
        setCameraCoords({
          lat: Number(camCoords.lat.toFixed(1)),
          lng: Number(camCoords.lng.toFixed(1)),
          altKm: Math.round(camera.position.length()),
        });

        // Compute 2D Screen-space positions for HUD badges
        const w = container.clientWidth || 800;
        const h = container.clientHeight || 500;
        const badges = [];

        const projectPos = (pos, id, title, subtitle, color, type, data) => {
          if (!pos) return;
          const worldPos = pos.clone().applyMatrix4(globeGroup.matrixWorld);
          
          // Check if object is facing camera (dot product > 0)
          const camDir = camera.position.clone().normalize();
          const objDir = worldPos.clone().normalize();
          if (camDir.dot(objDir) < 0.15) return; // Occluded on backside

          const projected = worldPos.project(camera);
          const screenX = (projected.x * 0.5 + 0.5) * w;
          const screenY = (-projected.y * 0.5 + 0.5) * h;

          badges.push({
            id,
            title,
            subtitle,
            color,
            type,
            data,
            x: screenX,
            y: screenY,
          });
        };

        if (trackedBadgesRef.spill) {
          projectPos(
            trackedBadgesRef.spill, 
            'spill', 
            'SPILL CORE #0906', 
            `${activeForecast.slickAreaKm2} km² · High Threat`, 
            'border-rose-500 text-rose-400 bg-rose-950/80',
            'SPILL',
            currentIncident
          );
        }

        if (trackedBadgesRef.vessel) {
          projectPos(
            trackedBadgesRef.vessel, 
            'vessel', 
            'MV SOLARA', 
            '91% Match · Tanker', 
            'border-amber-500 text-amber-300 bg-amber-950/80',
            'VESSEL',
            CANDIDATE_VESSELS[0]
          );
        }

        if (trackedBadgesRef.coral) {
          projectPos(
            trackedBadgesRef.coral, 
            'coral', 
            'LOPHELIA REEF', 
            'Critical Bioherm · 18.2 NM', 
            'border-emerald-500 text-emerald-400 bg-emerald-950/80',
            'ECOSYSTEM',
            ECOSYSTEM_ZONES[0]
          );
        }

        if (trackedBadgesRef.satellite) {
          projectPos(
            trackedBadgesRef.satellite, 
            'satellite', 
            'SENTINEL-1A SAR', 
            'Orbital Pass Active', 
            'border-sky-500 text-sky-400 bg-sky-950/80',
            'SATELLITE',
            { name: 'Sentinel-1A' }
          );
        }

        setHudBadges(badges);
      }

      // Animate dynamic objects (pulsing rings, beacons, threat photons)
      dynamicAnimObjects.forEach(obj => {
        if (obj.type === 'PULSE_RING' && obj.mesh) {
          const s = 1.0 + Math.sin(frame * 0.04) * 0.04;
          obj.mesh.scale.set(s, s, s);
        } else if (obj.type === 'BEACON' && obj.mesh) {
          const s = 1.0 + Math.sin(frame * 0.08) * 0.2;
          obj.mesh.scale.set(s, s, s);
        } else if (obj.type === 'ARC_PHOTON' && obj.mesh && obj.curve) {
          obj.progress += obj.speed;
          if (obj.progress > 1.0) obj.progress = 0;
          const pos = obj.curve.getPoint(obj.progress);
          obj.mesh.position.copy(pos);
        }
      });

      // Animate ocean current particles streaming 045° NE
      if (layers.currentsFlow !== false && particles) {
        const posArray = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const v = particleVels[i];
          v.lat += v.speed * 0.05;
          v.lng += v.speed * 0.08;
          if (v.lat > 63.5 || v.lng > 7.0) {
            v.lat = 59.5 + Math.random() * 1.5;
            v.lng = 2.0 + Math.random() * 2.0;
          }
          const p = latLngToVector3(v.lat, v.lng, GLOBE_RADIUS, 0.35);
          posArray[i * 3] = p.x;
          posArray[i * 3 + 1] = p.y;
          posArray[i * 3 + 2] = p.z;
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- Cleanup ---
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('wheel', onWheel);
      domElem.removeEventListener('click', onClick);
      domElem.removeEventListener('dblclick', onDoubleClick);
      renderer.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      earthTexture.dispose();
    };
  }, [
    activeHorizon,
    isAutoRotating,
    JSON.stringify(layers),
    openEntityModal,
    triggerCameraFocus,
  ]);

  // Reset Camera View to Incident Center
  const handleResetView = () => {
    setActivePoi('incident');
    if (context?.resetCamera) {
      context.resetCamera();
    } else {
      triggerCameraFocus(61.42, 4.18, 220);
    }
  };

  const handleZoom = (delta) => {
    if (!cameraRef.current) return;
    const newDist = THREE.MathUtils.clamp(cameraRef.current.position.length() + delta, 120, 480);
    cameraRef.current.position.setLength(newDist);
  };

  // Screenshot / Export Map
  const handleScreenshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `neeraksh-3d-digital-ocean-${activeHorizon}-${Date.now()}.png`;
    a.click();
    if (context?.addToast) context.addToast('Captured 3D globe tactical screenshot', 'success');
  };

  return (
    <div className={`relative bg-[#050c18] overflow-hidden select-none border border-slate-800 ${
      isFullScreen ? 'fixed inset-0 z-50 rounded-none' : 'rounded-2xl h-[540px] lg:h-[640px]'
    }`}>
      {/* 3D WebGL Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 2D Screen-Projected Interactive HUD Badges */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {hudBadges.map(badge => (
          <div
            key={badge.id}
            style={{
              position: 'absolute',
              left: `${badge.x}px`,
              top: `${badge.y}px`,
              transform: 'translate(-50%, -130%)',
            }}
            className="pointer-events-auto transition-transform hover:scale-110 duration-150"
          >
            <button
              type="button"
              onClick={() => openEntityModal && openEntityModal(badge.type, badge.data)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-xl text-left cursor-pointer ${badge.color}`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-ping shrink-0" />
              <div>
                <div className="text-[11px] font-bold font-mono tracking-tight leading-none">
                  {badge.title}
                </div>
                <div className="text-[9px] opacity-80 leading-tight mt-0.5 whitespace-nowrap">
                  {badge.subtitle}
                </div>
              </div>
            </button>
            {/* Visual connector pin downward */}
            <div className="w-[1px] h-2 bg-white/40 mx-auto" />
          </div>
        ))}
      </div>

      {/* Top Left Maritime Telemetry Overlay */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5 pointer-events-none">
        
        {/* Incident Center Header */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#091122]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/80 text-xs font-sans text-slate-200 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-sky-400 tracking-wide">3D DIGITAL OCEAN</span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-300 text-[11px]">{currentIncident.locationFormatted || '61.4200° N, 04.1800° E'}</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-mono text-[11px]">{activeHorizon} FORECAST</span>
        </div>

        {/* Real-time Cursor & Camera Coordinates Display */}
        <div className="pointer-events-auto flex items-center gap-3 bg-[#091122]/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 shadow-md">
          <span className="flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-cyan-400" />
            <span>Cursor:</span>
            <strong className="text-white">{cursorCoords.lat}°N, {cursorCoords.lng}°E</strong>
          </span>
          <span className="text-slate-700">|</span>
          <span>Depth: <strong className="text-sky-300">{cursorCoords.depth}m</strong></span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Cam: <strong className="text-slate-300">{cameraCoords.lat}°N, {cameraCoords.lng}°E</strong> (Alt {cameraCoords.altKm}km)</span>
        </div>

        {/* Dynamic Hovered Entity Telemetry Bar */}
        {hoveredEntity && (
          <div className="pointer-events-auto bg-[#0d172e]/95 backdrop-blur-md p-3 rounded-xl border border-sky-500/70 shadow-2xl max-w-sm transition-all animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Crosshair className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{hoveredEntity.title}</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">{hoveredEntity.details}</p>
            <span className="text-[10px] text-cyan-400 font-semibold block mt-1.5 uppercase tracking-wider">
              Click object to open telemetry dossier →
            </span>
          </div>
        )}
      </div>

      {/* Top Center Quick POI Fly-To Director Bar */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-1 bg-[#091122]/95 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-700/80 shadow-xl text-xs">
        <span className="text-[10px] font-mono text-slate-400 px-1.5 uppercase font-bold">Fly To:</span>
        {[
          { key: 'incident', label: 'Spill Epicenter', icon: Target, lat: 61.42, lng: 4.18, zoom: 200 },
          { key: 'vessel', label: 'MV Solara', icon: Ship, lat: 61.58, lng: 4.38, zoom: 170 },
          { key: 'coral', label: 'Lophelia Coral', icon: Trees, lat: 61.72, lng: 4.78, zoom: 180 },
          { key: 'fishery', label: 'Herring Ground', icon: Fish, lat: 61.58, lng: 4.52, zoom: 180 },
          { key: 'wide', label: 'North Sea Wide', icon: Compass, lat: 61.50, lng: 4.0, zoom: 320 },
        ].map(poi => {
          const Icon = poi.icon;
          const isActive = activePoi === poi.key;
          return (
            <button
              key={poi.key}
              type="button"
              onClick={() => triggerCameraFocus(poi.lat, poi.lng, poi.zoom, poi.key)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                isActive 
                  ? 'bg-sky-600 text-white shadow-md' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{poi.label}</span>
            </button>
          );
        })}
      </div>

      {/* Top Right Map View Controls */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-[#091122]/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 text-xs text-slate-300 shadow-lg">
        
        {/* Play/Pause Simulation Animation */}
        <button
          type="button"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? "Pause Auto Orbit" : "Start Auto Orbit"}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isAutoRotating ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Reset Camera to Incident */}
        <button
          type="button"
          onClick={handleResetView}
          title="Center on Incident (Sector 4B)"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-700" />

        {/* Zoom In */}
        <button
          type="button"
          onClick={() => handleZoom(-35)}
          title="Zoom In"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={() => handleZoom(35)}
          title="Zoom Out"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-700" />

        {/* Layer Controls Dropdown Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            title="Geospatial Layers"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLayerMenuOpen ? 'bg-sky-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Layer Menu Popup */}
          {isLayerMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#0a1122]/95 backdrop-blur-md p-3 rounded-xl border border-slate-700 shadow-2xl z-40 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="font-bold text-white uppercase text-[11px] tracking-wider">Geospatial Layers</span>
                <span className="text-[10px] text-sky-400 font-mono">11 Active</span>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {[
                  { key: 'satelliteSar', label: 'Sentinel-1 SAR Satellite', color: 'accent-sky-500' },
                  { key: 'aisVessels', label: 'AIS Fleet & Suspects', color: 'accent-amber-500' },
                  { key: 'oilSpill', label: 'Oil Slick & 3 Risk Rings', color: 'accent-rose-500' },
                  { key: 'threatArcs', label: '3D Threat Projection Arcs', color: 'accent-rose-400' },
                  { key: 'currentsFlow', label: 'Ocean Current Streamlines', color: 'accent-cyan-400' },
                  { key: 'drift24h', label: 'Predicted 24h Drift', color: 'accent-sky-400' },
                  { key: 'drift48h', label: 'Predicted 48h Drift', color: 'accent-orange-500' },
                  { key: 'coralEcosystem', label: 'Coral Reefs & Bioherms', color: 'accent-emerald-400' },
                  { key: 'protectedAreas', label: 'Marine Protected Areas', color: 'accent-emerald-500' },
                  { key: 'coastline', label: 'Coastline Contours', color: 'accent-cyan-400' },
                  { key: 'aisTracks', label: 'Vessel Movement Trails', color: 'accent-slate-400' },
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/80 cursor-pointer">
                    <span className="text-slate-300">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={layers[item.key] !== false}
                      onChange={() => toggleLayer && toggleLayer(item.key)}
                      className={`w-3.5 h-3.5 rounded ${item.color}`}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Screenshot Button */}
        <button
          type="button"
          onClick={handleScreenshot}
          title="Export Globe PNG"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        {onToggleFullScreen && (
          <button
            type="button"
            onClick={onToggleFullScreen}
            title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Globe"}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Bottom Center Active Forecast Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 bg-[#091122]/95 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/80 text-xs flex flex-wrap items-center gap-3 shadow-xl pointer-events-none">
        <span className="flex items-center gap-1.5 text-sky-400 font-bold font-mono text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          ACTIVE TIMELINE: {activeForecast.label}
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300 text-[11px]">
          Slick: <strong className="text-rose-400">{activeForecast.slickAreaKm2} km²</strong>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300 text-[11px]">
          Shoreline Threat: <strong className="text-amber-400">{activeForecast.coastalDistanceNM} NM</strong>
        </span>
        <span className="text-slate-600 hidden sm:inline">|</span>
        <span className="text-slate-300 text-[11px] hidden sm:inline">
          Landfall Risk: <strong className={activeForecast.landfallProbability > 50 ? 'text-rose-400' : 'text-emerald-400'}>
            {activeForecast.landfallProbability}%
          </strong>
        </span>
      </div>

      {/* Bottom Left Quick Layer Toggles Strip */}
      <div className="absolute bottom-3 left-3 z-30 hidden md:flex items-center gap-1.5 bg-[#091122]/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 shadow-md">
        <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Layers:</span>
        <button
          type="button"
          onClick={() => toggleLayer && toggleLayer('satelliteSar')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
            layers.satelliteSar !== false ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-slate-800 text-slate-500'
          }`}
        >
          🛰️ SAR
        </button>
        <button
          type="button"
          onClick={() => toggleLayer && toggleLayer('aisVessels')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
            layers.aisVessels !== false ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-500'
          }`}
        >
          🚢 AIS
        </button>
        <button
          type="button"
          onClick={() => toggleLayer && toggleLayer('oilSpill')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
            layers.oilSpill !== false ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-500'
          }`}
        >
          🛢️ Spill
        </button>
        <button
          type="button"
          onClick={() => toggleLayer && toggleLayer('threatArcs')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
            layers.threatArcs !== false ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-500'
          }`}
        >
          ⚠️ Arcs
        </button>
        <button
          type="button"
          onClick={() => toggleLayer && toggleLayer('currentsFlow')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
            layers.currentsFlow !== false ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-500'
          }`}
        >
          🌊 Currents
        </button>
        <button
          type="button"
          onClick={() => toggleLayer && toggleLayer('coralEcosystem')}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors cursor-pointer ${
            layers.coralEcosystem !== false ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
          }`}
        >
          🪸 Corals
        </button>
      </div>

    </div>
  );
}
