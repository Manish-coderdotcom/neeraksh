import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Compass, 
  RotateCcw, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Eye, 
  Crosshair, 
  Info, 
  ZoomIn, 
  ZoomOut,
  Sparkles
} from 'lucide-react';
import { 
  INCIDENT_PROFILE, 
  PREDICTION_TIMELINE, 
  CANDIDATE_VESSELS, 
  ECOSYSTEM_ZONES, 
  RISK_ZONES, 
  EMERGENCY_ACTIONS,
  GEOSPATIAL_ANCHORS 
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

export default function OceanGlobe3D({
  currentHorizon = "0H",
  selectedEntity = null,
  onSelectEntity = null,
  layerVisibility = null,
  onToggleLayer = null,
  isFullScreen = false,
  onToggleFullScreen = null,
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const globeGroupRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [hoveredEntity, setHoveredEntity] = useState(null);
  const [cameraDistance, setCameraDistance] = useState(240);

  // Active prediction index for expansion sizing
  const horizonIndex = PREDICTION_TIMELINE.findIndex(p => p.horizonKey === currentHorizon);
  const activeForecast = PREDICTION_TIMELINE[horizonIndex >= 0 ? horizonIndex : 0];

  // Default layers if not passed
  const layers = layerVisibility || {
    spill: true,
    trajectory: true,
    riskZones: true,
    vessels: true,
    ecosystem: true,
    emergency: true,
    shippingLanes: true,
    graticule: true,
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 3000);
    cameraRef.current = camera;

    // Position camera focused towards North Sea (61.42° N, 4.18° E)
    const targetVector = latLngToVector3(61.42, 4.18, GLOBE_RADIUS);
    const cameraPos = targetVector.clone().normalize().multiplyScalar(220);
    camera.position.copy(cameraPos);
    camera.lookAt(targetVector);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xe0f2fe, 2.5);
    sunLight.position.set(300, 200, 250);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x0ea5e9, 1.2);
    rimLight.position.set(-300, -100, -250);
    scene.add(rimLight);

    // --- 3. Earth Globe Mesh & Procedural Ocean Texture ---
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // High quality procedural Canvas Texture for Earth oceans and landmasses
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep bathymetric navy ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#061325');
    oceanGrad.addColorStop(0.3, '#08172e');
    oceanGrad.addColorStop(0.5, '#0a1d3a');
    oceanGrad.addColorStop(0.7, '#08172e');
    oceanGrad.addColorStop(1, '#061325');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Latitude / Longitude graticule lines on texture
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
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

    // Stylized procedural European & Arctic continent landmass contours
    ctx.fillStyle = '#111d33';
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 1.5;

    // Helper to draw projected landmass approximations
    function drawPoly(pts) {
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
    }

    // Scandinavia / Norway / Sweden landmass
    drawPoly([[58, 6], [62, 5], [66, 12], [71, 28], [70, 31], [65, 22], [59, 18], [56, 12], [58, 6]]);
    // UK & Ireland
    drawPoly([[50, -5], [54, -3], [58, -5], [58, -2], [53, 0], [51, 1], [50, -5]]);
    drawPoly([[51.5, -10], [55, -8], [55, -6], [52, -6], [51.5, -10]]);
    // Western Europe & Baltic
    drawPoly([[44, -1], [48, -4], [51, 2], [54, 8], [55, 12], [54, 19], [48, 17], [45, 13], [43, 3], [44, -1]]);
    // Iceland
    drawPoly([[63.5, -24], [66.5, -22], [66, -14], [64, -14], [63.5, -24]]);
    // Greenland East Coast outline
    drawPoly([[60, -45], [68, -30], [75, -20], [80, -18], [80, -35], [70, -48], [60, -45]]);
    // Svalbard
    drawPoly([[76, 15], [80, 16], [80, 28], [76, 25], [76, 15]]);

    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 96, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.75,
      metalness: 0.15,
      bumpScale: 0.08,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Atmospheric Glow Shield (Subtle cyan Fresnel halo)
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 64, 48);
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
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.22, 0.74, 0.97, 1.0) * intensity * 0.85;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // --- 4. Interactive Clickable Entities Group ---
    const entitiesGroup = new THREE.Group();
    globeGroup.add(entitiesGroup);

    // Store references for raycasting
    const interactiveMeshes = [];

    // (A) Oil Spill Slick Polygon Mesh & Concentric Pulse Rings
    if (layers.spill) {
      const spillPos = latLngToVector3(INCIDENT_PROFILE.coordinates.lat, INCIDENT_PROFILE.coordinates.lng, GLOBE_RADIUS, 0.3);
      
      // Dynamic slick radius scaled with current horizon
      const growthScale = 0.8 + (horizonIndex * 0.35);
      const slickRadius = 3.2 * growthScale;

      const slickGeo = new THREE.CircleGeometry(slickRadius, 32);
      const slickMat = new THREE.MeshBasicMaterial({
        color: 0x0f172a, // Dark hydrocarbon crude core
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });
      const slickMesh = new THREE.Mesh(slickGeo, slickMat);
      slickMesh.position.copy(spillPos);
      slickMesh.lookAt(spillPos.clone().multiplyScalar(2));
      slickMesh.userData = {
        type: 'SPILL',
        title: 'Active Oil Slick Origin',
        details: `${INCIDENT_PROFILE.name} · ${activeForecast.slickAreaKm2} km² (${activeForecast.volumeRemainingBbl} bbl)`,
        data: INCIDENT_PROFILE,
      };
      entitiesGroup.add(slickMesh);
      interactiveMeshes.push(slickMesh);

      // Warning perimeter ring around slick
      const ringGeo = new THREE.RingGeometry(slickRadius * 1.05, slickRadius * 1.35, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xef4444, // Crimson warning ring
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(spillPos);
      ringMesh.lookAt(spillPos.clone().multiplyScalar(2));
      entitiesGroup.add(ringMesh);

      // Spill Label / Pulse Beacon
      const beaconGeo = new THREE.SphereGeometry(0.8, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.copy(spillPos.clone().multiplyScalar(1.01));
      entitiesGroup.add(beaconMesh);
    }

    // (B) 6h-72h Predicted Trajectory Ribbon with Arrow Waypoints
    if (layers.trajectory) {
      const trajPoints = PREDICTION_TIMELINE.map(p => 
        latLngToVector3(p.coordinates.lat, p.coordinates.lng, GLOBE_RADIUS, 0.45)
      );

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
        title: 'Hydrodynamic Drift Forecast (0-72h)',
        details: 'Drift velocity: 1.62 kts @ 048° NE. Landfall ETA: 68h.',
        data: PREDICTION_TIMELINE,
      };
      entitiesGroup.add(trajectoryMesh);
      interactiveMeshes.push(trajectoryMesh);

      // Add clickable waypoint pins at each horizon
      PREDICTION_TIMELINE.forEach((wp, idx) => {
        const wpPos = latLngToVector3(wp.coordinates.lat, wp.coordinates.lng, GLOBE_RADIUS, 0.6);
        const pinGeo = new THREE.ConeGeometry(0.7, 1.8, 16);
        pinGeo.rotateX(Math.PI);
        const pinMat = new THREE.MeshStandardMaterial({
          color: idx === horizonIndex ? 0xffffff : (idx === 0 ? 0x38bdf8 : (idx > 3 ? 0xef4444 : 0xeab308)),
          emissive: idx === horizonIndex ? 0x38bdf8 : 0x000000,
          emissiveIntensity: 0.6,
        });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.position.copy(wpPos);
        pinMesh.lookAt(wpPos.clone().multiplyScalar(2));
        pinMesh.userData = {
          type: 'WAYPOINT',
          title: `Forecast Horizon: ${wp.label}`,
          details: `Area: ${wp.slickAreaKm2} km² · Shoreline Dist: ${wp.coastalDistanceNM} NM · Landfall Risk: ${wp.landfallProbability}%`,
          data: wp,
        };
        entitiesGroup.add(pinMesh);
        interactiveMeshes.push(pinMesh);
      });
    }

    // (C) Dynamic Concentric Risk Zones (Red, Orange, Yellow, Green)
    if (layers.riskZones) {
      const centerPos = latLngToVector3(INCIDENT_PROFILE.coordinates.lat, INCIDENT_PROFILE.coordinates.lng, GLOBE_RADIUS, 0.15);
      
      const zoneRadii = [
        { tier: 'RED', radius: 4.8, color: 0xef4444, opacity: 0.28 },
        { tier: 'ORANGE', radius: 8.5, color: 0xf97316, opacity: 0.18 },
        { tier: 'YELLOW', radius: 13.5, color: 0xeab308, opacity: 0.12 },
        { tier: 'GREEN', radius: 19.0, color: 0x10b981, opacity: 0.08 },
      ];

      zoneRadii.forEach(z => {
        const ringGeo = new THREE.CircleGeometry(z.radius, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: z.color,
          transparent: true,
          opacity: z.opacity,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(ringGeo, ringMat);
        mesh.position.copy(centerPos);
        mesh.lookAt(centerPos.clone().multiplyScalar(2));
        mesh.userData = {
          type: 'RISK_ZONE',
          title: `${z.tier} RISK ENVELOPE`,
          details: `Dynamic risk perimeter calibrated to ${z.radius * 2} NM dispersion corridor.`,
          data: RISK_ZONES.find(rz => rz.tier === z.tier),
        };
        entitiesGroup.add(mesh);
        interactiveMeshes.push(mesh);
      });
    }

    // (D) AIS Vessel Candidates Markers with Heading Orientation
    if (layers.vessels) {
      CANDIDATE_VESSELS.forEach(v => {
        // Parse position from vessel object
        const parts = v.lastKnownPosition.split(',');
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (isNaN(lat) || isNaN(lng)) return;

        const vPos = latLngToVector3(lat, lng, GLOBE_RADIUS, 0.6);
        
        // Vessel 3D Marker: Hull box + heading pointer
        const vGroup = new THREE.Group();
        vGroup.position.copy(vPos);

        const hullGeo = new THREE.BoxGeometry(0.8, 0.4, 1.8);
        const hullColor = v.statusBadge === 'red' ? 0xef4444 : (v.statusBadge === 'amber' ? 0xf59e0b : (v.statusBadge === 'blue' ? 0x38bdf8 : 0x10b981));
        const hullMat = new THREE.MeshStandardMaterial({
          color: hullColor,
          metalness: 0.4,
          roughness: 0.4,
        });
        const hullMesh = new THREE.Mesh(hullGeo, hullMat);
        vGroup.add(hullMesh);

        // Heading arrow
        const arrowGeo = new THREE.ConeGeometry(0.35, 0.9, 12);
        arrowGeo.rotateX(Math.PI / 2);
        const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
        arrowMesh.position.set(0, 0.3, 1.2);
        vGroup.add(arrowMesh);

        vGroup.lookAt(vPos.clone().multiplyScalar(2));
        vGroup.rotateZ(THREE.MathUtils.degToRad(-v.currentHeadingDeg));

        hullMesh.userData = {
          type: 'VESSEL',
          title: `${v.name} (${v.type})`,
          details: `MMSI: ${v.mmsi} · Speed: ${v.currentSpeedKnots} kt · Score: ${v.correlationScore}/100 · ${v.role}`,
          data: v,
        };
        entitiesGroup.add(vGroup);
        interactiveMeshes.push(hullMesh);

        // Vessel historical track line
        if (v.historicalTrack && v.historicalTrack.length > 1) {
          const trackPts = v.historicalTrack.map(tp => latLngToVector3(tp.lat, tp.lng, GLOBE_RADIUS, 0.3));
          const lineGeo = new THREE.BufferGeometry().setFromPoints(trackPts);
          const lineMat = new THREE.LineDashedMaterial({
            color: v.id === 'solara' ? 0xef4444 : 0x64748b,
            dashSize: 1,
            gapSize: 0.5,
            linewidth: 1,
          });
          const trackLine = new THREE.Line(lineGeo, lineMat);
          trackLine.computeLineDistances();
          entitiesGroup.add(trackLine);
        }
      });
    }

    // (E) Marine Ecosystems Hotspots (Corals, Fisheries, MPAs)
    if (layers.ecosystem) {
      ECOSYSTEM_ZONES.forEach(eco => {
        const ecoPos = latLngToVector3(eco.coordinates.lat, eco.coordinates.lng, GLOBE_RADIUS, 0.4);
        const ecoGeo = new THREE.OctahedronGeometry(1.0, 0);
        const ecoMat = new THREE.MeshStandardMaterial({
          color: eco.riskColor === '#ef4444' ? 0xef4444 : (eco.riskColor === '#f97316' ? 0xf97316 : 0x10b981),
          wireframe: false,
          metalness: 0.2,
          roughness: 0.6,
        });
        const ecoMesh = new THREE.Mesh(ecoGeo, ecoMat);
        ecoMesh.position.copy(ecoPos);
        ecoMesh.userData = {
          type: 'ECOSYSTEM',
          title: eco.name,
          details: `${eco.category} · Threat: ${eco.vulnerabilityLevel} · Time to Exposure: ${eco.timeToPotentialExposureHours}h`,
          data: eco,
        };
        entitiesGroup.add(ecoMesh);
        interactiveMeshes.push(ecoMesh);

        // Halo ring around ecosystem
        const haloGeo = new THREE.RingGeometry(1.2, 1.8, 16);
        const haloMat = new THREE.MeshBasicMaterial({
          color: eco.riskColor === '#ef4444' ? 0xef4444 : 0x10b981,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.position.copy(ecoPos);
        haloMesh.lookAt(ecoPos.clone().multiplyScalar(2));
        entitiesGroup.add(haloMesh);
      });
    }

    // (F) Emergency Response Units & Coast Guard Assets
    if (layers.emergency) {
      EMERGENCY_ACTIONS.forEach(act => {
        // Approximate Florø / Bergen base or deployment point
        const actPos = latLngToVector3(61.25, 4.5, GLOBE_RADIUS, 0.5);
        const assetGeo = new THREE.TetrahedronGeometry(0.9, 0);
        const assetMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const assetMesh = new THREE.Mesh(assetGeo, assetMat);
        assetMesh.position.copy(actPos);
        assetMesh.userData = {
          type: 'EMERGENCY_ASSET',
          title: act.title,
          details: `Asset: ${act.assignedAsset} · ETA: ${act.etaMinutes} min · Status: ${act.status}`,
          data: act,
        };
        entitiesGroup.add(assetMesh);
        interactiveMeshes.push(assetMesh);
      });
    }

    // (G) Ports & Shipping Lanes
    if (layers.shippingLanes) {
      GEOSPATIAL_ANCHORS.shippingLanes.forEach(lane => {
        const lanePts = lane.points.map(pt => latLngToVector3(pt.lat, pt.lng, GLOBE_RADIUS, 0.2));
        const curve = new THREE.CatmullRomCurve3(lanePts);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.18, 6, false);
        const tubeMat = new THREE.MeshBasicMaterial({
          color: 0x0284c7,
          transparent: true,
          opacity: 0.45,
        });
        const laneMesh = new THREE.Mesh(tubeGeo, tubeMat);
        entitiesGroup.add(laneMesh);
      });

      GEOSPATIAL_ANCHORS.ports.forEach(port => {
        const portPos = latLngToVector3(port.lat, port.lng, GLOBE_RADIUS, 0.4);
        const portGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const portMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
        const portMesh = new THREE.Mesh(portGeo, portMat);
        portMesh.position.copy(portPos);
        portMesh.userData = {
          type: 'PORT',
          title: `Port: ${port.name}`,
          details: `${port.type} · ${port.country}`,
          data: port,
        };
        entitiesGroup.add(portMesh);
        interactiveMeshes.push(portMesh);
      });
    }

    // --- 5. Mouse Orbit & Pan Interaction Controls ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;

        // Rotate globe on Y and X axes
        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;

        // Clamp vertical tilt to avoid flipping
        globeGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroup.rotation.x));

        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        // Raycasting Hover Detection
        raycaster.setFromCamera(mouseVector, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes, false);
        if (intersects.length > 0) {
          const hovered = intersects[0].object.userData;
          setHoveredEntity(hovered);
          container.style.cursor = 'pointer';
        } else {
          setHoveredEntity(null);
          container.style.cursor = 'grab';
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.15;
      const newDistance = THREE.MathUtils.clamp(camera.position.length() + zoomFactor, 130, 450);
      camera.position.setLength(newDistance);
      setCameraDistance(Math.round(newDistance));
    };

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);

      if (intersects.length > 0) {
        const targetData = intersects[0].object.userData;
        if (onSelectEntity) {
          onSelectEntity(targetData);
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });
    domElem.addEventListener('click', onClick);

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

      if (isAutoRotating) {
        globeGroup.rotation.y += 0.0012;
      }

      // Atmospheric & pulse effects
      atmosMat.uniforms = atmosMat.uniforms || {};

      renderer.render(scene, camera);
    };
    animate();

    // --- Cleanup on unmount ---
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('wheel', onWheel);
      domElem.removeEventListener('click', onClick);
      renderer.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      earthTexture.dispose();
    };
  }, [currentHorizon, isAutoRotating, JSON.stringify(layers)]);

  // Reset Camera View to Incident Center
  const handleResetView = () => {
    if (!cameraRef.current || !globeGroupRef.current) return;
    globeGroupRef.current.rotation.set(0, 0, 0);
    const targetVector = latLngToVector3(61.42, 4.18, GLOBE_RADIUS);
    const cameraPos = targetVector.clone().normalize().multiplyScalar(220);
    cameraRef.current.position.copy(cameraPos);
    cameraRef.current.lookAt(targetVector);
  };

  const handleZoom = (delta) => {
    if (!cameraRef.current) return;
    const newDist = THREE.MathUtils.clamp(cameraRef.current.position.length() + delta, 130, 450);
    cameraRef.current.position.setLength(newDist);
    setCameraDistance(Math.round(newDist));
  };

  return (
    <div className={`relative bg-[#050c18] overflow-hidden select-none border border-slate-800 ${
      isFullScreen ? 'fixed inset-0 z-50 rounded-none' : 'rounded-2xl h-[520px] lg:h-[620px]'
    }`}>
      {/* 3D WebGL Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Maritime Telemetry Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-[#091122]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-sans text-slate-200 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-sky-400">3D DIGITAL OCEAN</span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-slate-300 text-[11px]">{INCIDENT_PROFILE.locationFormatted}</span>
        </div>

        {/* Dynamic Hovered Entity Telemetry Bar */}
        {hoveredEntity && (
          <div className="pointer-events-auto bg-[#0d172e]/95 backdrop-blur-md p-2.5 rounded-xl border border-sky-500/50 shadow-xl max-w-sm transition-all animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Crosshair className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{hoveredEntity.title}</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{hoveredEntity.details}</p>
          </div>
        )}
      </div>

      {/* Top Right Map View Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-[#091122]/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-lg">
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

        <button
          type="button"
          onClick={handleResetView}
          title="Center on Incident (Sector 4B)"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-700" />

        <button
          type="button"
          onClick={() => handleZoom(-30)}
          title="Zoom In"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleZoom(30)}
          title="Zoom Out"
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

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
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-[#091122]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800 text-xs flex items-center gap-3 shadow-lg pointer-events-none">
        <span className="flex items-center gap-1.5 text-sky-400 font-semibold font-mono text-[11px]">
          <Sparkles className="w-3.5 h-3.5" />
          ACTIVE TIMELINE: {activeForecast.label}
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300 text-[11px]">
          Slick: <span className="text-rose-400 font-semibold">{activeForecast.slickAreaKm2} km²</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-300 text-[11px]">
          Shoreline Threat: <span className="text-amber-400 font-semibold">{activeForecast.coastalDistanceNM} NM</span>
        </span>
      </div>

      {/* Bottom Left Legend Summary */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-2 bg-[#091122]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 pointer-events-none">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Spill Core</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span>72h Drift</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Vessels</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Corals & MPAs</span>
        </span>
      </div>
    </div>
  );
}
