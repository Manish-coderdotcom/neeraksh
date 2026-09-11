// Centralized mock data for TIDEMARK system

export const INCIDENT_DATA = {
  id: "INC-2026-0906-NOR",
  name: "North Sea Spill Incident #0906",
  location: "61.42°N, 4.18°E",
  coordinates: { lat: 61.42, lng: 4.18 },
  region: "Norwegian Economic Zone (Offshore Vestland)",
  detectionTime: "2026-09-06 07:42 UTC",
  estimatedOnset: "2026-09-06 05:42 UTC",
  confidence: "91%",
  confidenceScore: 91,
  slickType: "Heavy Crude Oil Slick",
  baseSizeKm2: 14.8,
  maxSizeKm2: 28.4,
  estimatedVolume: "420 - 680 Barrels",
  windVector: "215° @ 14 knots (SW)",
  currentDrift: "045° @ 1.2 knots (NE)",
  seaState: "State 3 (Moderate, 1.2m wave height)",
  sarPassId: "SENTINEL-1A-EW-GRDM-20260906T074211",
  sarSatellite: "Sentinel-1A (C-band SAR)",
  opticalSatellite: "Sentinel-2B (MSI)",
  cloudCover: "88.4% (Optical Impaired)",
};

export const VESSELS = [
  {
    id: "solara",
    name: "MV Solara",
    type: "Crude Oil Tanker",
    flag: "Panama 🇵🇦",
    mmsi: "257842190",
    imo: "9482910",
    callsign: "3FGL9",
    status: "Signal lost",
    statusBadge: "red",
    speed: "17.4 kt",
    speedValue: 17.4,
    heading: "042°",
    sarMatch: "SAR hull match",
    attributionScore: 91,
    confidenceCategory: "High",
    rank: 1,
    scores: {
      proximity: 94,
      aisGap: 96,
      speedAnomaly: 84,
    },
    aisGapDetails: "AIS transponder dark from T-2.0h to T+0.0h (05:42 UTC to 07:42 UTC)",
    anomalySummary: "AIS transponder dark during estimated leak onset. Speed increased significantly (+6.2 kts) immediately after transponder signal resumed.",
    lastHeading: "042° NE",
    trackPoints: [
      { time: "05:00 UTC", lat: 61.30, lng: 4.02, speed: 11.2, status: "Normal route" },
      { time: "05:42 UTC", lat: 61.38, lng: 4.12, speed: 11.0, status: "AIS signal lost (Transponder Gap)" },
      { time: "07:42 UTC", lat: 61.58, lng: 4.38, speed: 17.4, status: "SAR pass detects slick along path" },
      { time: "07:45 UTC", lat: 61.60, lng: 4.40, speed: 17.4, status: "AIS signal resumed (Speed anomaly)" },
    ]
  },
  {
    id: "helios",
    name: "Helios Star",
    type: "Product Tanker",
    flag: "Liberia 🇱🇷",
    mmsi: "248301772",
    imo: "9614201",
    callsign: "A8KL2",
    status: "Active",
    statusBadge: "amber",
    speed: "14.2 kt",
    speedValue: 14.2,
    heading: "095°",
    sarMatch: "No match",
    attributionScore: 34,
    confidenceCategory: "Low",
    rank: 2,
    scores: {
      proximity: 42,
      aisGap: 20,
      speedAnomaly: 25,
    },
    aisGapDetails: "Brief 12-min transponder latency reported at 06:15 UTC.",
    anomalySummary: "Vessel passed 4.2 NM south-east of origin point. No hull radar anomaly detected in SAR imagery.",
    lastHeading: "095° E",
    trackPoints: [
      { time: "05:00 UTC", lat: 61.25, lng: 4.30, speed: 14.0, status: "Active track" },
      { time: "07:42 UTC", lat: 61.32, lng: 4.65, speed: 14.2, status: "Active track" },
    ]
  },
  {
    id: "nordic",
    name: "Nordic Carrier",
    type: "Bulk Carrier",
    flag: "Norway 🇳🇴",
    mmsi: "219004521",
    imo: "9321098",
    callsign: "LAX99",
    status: "Active",
    statusBadge: "green",
    speed: "12.1 kt",
    speedValue: 12.1,
    heading: "028°",
    sarMatch: "No match",
    attributionScore: 18,
    confidenceCategory: "Low",
    rank: 3,
    scores: {
      proximity: 24,
      aisGap: 0,
      speedAnomaly: 12,
    },
    aisGapDetails: "Continuous AIS broadcast recorded. 0 transponder gaps.",
    anomalySummary: "Maintained constant speed and commercial lane geometry throughout observation window.",
    lastHeading: "028° NNE",
    trackPoints: [
      { time: "05:00 UTC", lat: 61.10, lng: 3.90, speed: 12.0, status: "Normal commercial transit" },
      { time: "07:42 UTC", lat: 61.50, lng: 4.10, speed: 12.1, status: "Normal commercial transit" },
    ]
  },
  {
    id: "pacific",
    name: "Pacific Voyager",
    type: "Container Ship",
    flag: "Marshall Islands 🇲🇭",
    mmsi: "371029384",
    imo: "9755431",
    callsign: "V7BC4",
    status: "Active",
    statusBadge: "green",
    speed: "19.8 kt",
    speedValue: 19.8,
    heading: "185°",
    sarMatch: "No match",
    attributionScore: 12,
    confidenceCategory: "Low",
    rank: 4,
    scores: {
      proximity: 15,
      aisGap: 0,
      speedAnomaly: 8,
    },
    aisGapDetails: "Continuous high-frequency AIS broadcast recorded.",
    anomalySummary: "Container carrier transiting southbound in designated fairway 8.5 NM west of spill origin.",
    lastHeading: "185° S",
    trackPoints: [
      { time: "05:00 UTC", lat: 61.70, lng: 3.80, speed: 19.5, status: "Container lane transit" },
      { time: "07:42 UTC", lat: 61.20, lng: 3.75, speed: 19.8, status: "Container lane transit" },
    ]
  },
  {
    id: "coastguard",
    name: "Coastal Guard 14",
    type: "Patrol / Response Vessel",
    flag: "Norway 🇳🇴",
    mmsi: "259811004",
    imo: "9800142",
    callsign: "LNCG",
    status: "Responder",
    statusBadge: "blue",
    speed: "24.0 kt",
    speedValue: 24.0,
    heading: "310°",
    sarMatch: "Authorized responder",
    attributionScore: 0,
    confidenceCategory: "Responder",
    rank: 5,
    scores: {
      proximity: 50,
      aisGap: 0,
      speedAnomaly: 0,
    },
    aisGapDetails: "Official Maritime Authority Response Vessel.",
    anomalySummary: "Dispatched by Norwegian Coast Guard (Kystverket) to intercept MV Solara and deploy containment boom.",
    lastHeading: "310° NW",
    trackPoints: [
      { time: "07:50 UTC", lat: 61.15, lng: 4.60, speed: 24.0, status: "Emergency Response Intercept" },
    ]
  }
];

export const TIMELINE_EVENTS = [
  { id: 1, time: "05:15 UTC", label: "MV Solara Enters Zone", detail: "Vessel detected entering North Sea Sector 4B at 11.2 kts.", type: "info" },
  { id: 2, time: "05:42 UTC", label: "Estimated Leak Onset", detail: "Calculated origin point. AIS transponder signal disabled on MV Solara.", type: "warning" },
  { id: 3, time: "06:30 UTC", label: "Unmonitored Slick Drift", detail: "Current drift velocity 1.2 kts NE. Wind shear expanding slick fringe.", type: "info" },
  { id: 4, time: "07:42 UTC", label: "Sentinel-1 SAR Slick Detected", detail: "Synthetic Aperture Radar pass captures 14.8 km² dark backscatter anomaly.", type: "critical" },
  { id: 5, time: "07:45 UTC", label: "AIS Signal Resumed", detail: "MV Solara transponder re-engages 18.2 NM NE of origin. Speed: 17.4 kts.", type: "warning" },
  { id: 6, time: "08:15 UTC", label: "Automated Attribution Complete", detail: "TIDEMARK neural network correlates SAR slick vector to MV Solara (91/100 score).", type: "success" },
  { id: 7, time: "08:30 UTC", label: "Coast Guard Dispatched", detail: "Norwegian Coastal Administration alerts Patrol Vessel Coastal Guard 14.", type: "info" },
];

export const CHALLENGES_LIST = [
  {
    id: 1,
    num: "01",
    title: "Clouds & Poor Visibility",
    problem: "Optical satellites (like Sentinel-2 or Landsat) cannot penetrate cloud cover, fog, or nighttime sea conditions, causing frequent monitoring gaps.",
    solution: "TIDEMARK prioritizes Sentinel-1 C-band Synthetic Aperture Radar (SAR), which emits microwave signals that penetrate clouds, precipitation, and darkness 24/7.",
    targetView: "satellite",
    linkText: "See it in Satellite Imagery",
    icon: "CloudOff"
  },
  {
    id: 2,
    num: "02",
    title: "Oil vs Look-alike Features",
    problem: "Natural phenomena like algae blooms, ocean surface low-wind zones, biogenic slicks, and rain cells produce dark radar backscatter similar to oil slicks.",
    solution: "Uses a multi-spectral Convolutional Neural Network (U-Net + ResNet backbones) trained on texture dampening, wind-field thresholds, and historical bloom databases.",
    targetView: "satellite",
    linkText: "See it in AI Classification",
    icon: "Layers"
  },
  {
    id: 3,
    num: "03",
    title: "Missing or Spoofed AIS",
    problem: "Offending vessels frequently disable AIS transponders ('dark ships') or transmit spoofed GPS coordinates during illegal bilge or tank wash dumping.",
    solution: "Treats transponder signal loss as primary forensic evidence. Correlates gap entry/exit points with SAR ship wake vectors and post-gap speed anomalies.",
    targetView: "ais",
    linkText: "See it in AIS Data",
    icon: "Radio"
  },
  {
    id: 4,
    num: "04",
    title: "Large Data Volumes",
    problem: "Continuous global satellite passes and gigabytes of high-frequency maritime AIS telemetry overwhelm traditional desktop GIS software.",
    solution: "Employs tile-based GPU cloud inference, spatial indexing (H3 geospatial grid), and stream-processing architecture for fast automated analysis.",
    targetView: "architecture",
    linkText: "See it in Architecture",
    icon: "Database"
  },
  {
    id: 5,
    num: "05",
    title: "Real-time Processing Delays",
    problem: "Oil slicks drift and dissipate rapidly with tides and wind; delayed detection hinders physical containment and legal evidence gathering.",
    solution: "Near-Real-Time (NRT) automated pipeline executes slick segmentation and vessel spatio-temporal pairing within < 4 minutes of satellite image availability.",
    targetView: "dashboard",
    linkText: "See it in Dashboard",
    icon: "Zap"
  }
];

export const ARCHITECTURE_STEPS = [
  { step: "01", name: "Satellite Data", desc: "Sentinel-1 SAR & Sentinel-2 Optical ingestion", icon: "Satellite" },
  { step: "02", name: "Data Ingestion", desc: "Automated ESA CopHub API stream", icon: "Download" },
  { step: "03", name: "Pre-processing", desc: "Speckle filtering, terrain correction, thermal calibration", icon: "Sliders" },
  { step: "04", name: "AI/ML Detection", desc: "U-Net neural segmentation of sea backscatter", icon: "Cpu" },
  { step: "05", name: "Oil Classification", desc: "Differentiates true slick vs algae/look-alikes (91% confidence)", icon: "CheckCircle" },
  { step: "06", name: "AIS Data Fusion", desc: "Global AIS stream spatio-temporal pairing", icon: "Radio" },
  { step: "07", name: "Spatio-temporal", desc: "Drift model & transponder gap backtracking", icon: "Compass" },
  { step: "08", name: "Vessel Attribution", desc: "Bayesian confidence scoring (91/100 candidate match)", icon: "Target" },
  { step: "09", name: "Alerts & Reports", desc: "Automated authority notifications & legal PDF/TXT evidence pack", icon: "FileText" },
];

export const ARCH_TECH_STACK = [
  { name: "Python 3.11", category: "Core Engine", desc: "PyTorch, Rasterio, GDAL geospatial processing", badge: "Backend" },
  { name: "Machine Learning", category: "AI Models", desc: "U-Net + ResNet-50 SAR slick segmentation", badge: "AI/ML" },
  { name: "CNN / Mask R-CNN", category: "Vessel Extraction", desc: "SAR hull backscatter & ship wake detection", badge: "Vision" },
  { name: "GIS & Spatial APIs", category: "Geospatial", desc: "QGIS Python API, Pyproj, Shapely, GeoPandas", badge: "GIS" },
  { name: "AWS Cloud Infrastructure", category: "Deployment", desc: "AWS Lambda, S3 raster buckets, ECS GPU instances", badge: "Cloud" },
  { name: "React + Tailwind", category: "Mission Control UI", desc: "Real-time tactical web dashboard with SVG GIS engine", badge: "Frontend" },
  { name: "Real-time WebSockets", category: "Streaming API", desc: "Live AIS stream ingestion & instant alert push", badge: "Realtime" },
  { name: "FastAPI Pipelines", category: "REST Services", desc: "Microservices for vector drift calculation & PDF export", badge: "API" },
];

export const ADVANCED_FEATURES = [
  { title: "AI-driven Oil Classification", desc: "Convolutional neural network distinguishes genuine petroleum slicks from biogenic look-alikes with 94.2% historical accuracy." },
  { title: "Spill Trajectory Prediction", desc: "Hydrodynamic ocean drift forecasting model powered by NOAA wind and Copernicus current vectors." },
  { title: "Multi-sensor Fusion", desc: "Simultaneous cross-validation merging C-band SAR radar, optical spectral bands, and thermal infrared sensors." },
  { title: "Vessel Anomaly Detection", desc: "Identifies suspicious AIS transponder turn-offs, sudden course changes, and ballast dumping speed profiles." },
  { title: "Automated Authority Reporting", desc: "Generates standardized IMO / MARPOL Annex I violation evidence packages in one click." },
  { title: "Blockchain Evidence Trail", desc: "Optional cryptographic timestamping of raw SAR imagery and attribution hashes for legal prosecution." },
];
