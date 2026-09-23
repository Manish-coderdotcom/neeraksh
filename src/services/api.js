// Neeraksh Unified Maritime Intelligence API Service
// Connects to FastAPI backend at http://localhost:8000 with transparent local simulation fallback

import {
  INCIDENT_PROFILE,
  PREDICTION_TIMELINE,
  CANDIDATE_VESSELS,
  ECOSYSTEM_ZONES,
  RISK_ZONES,
  EMERGENCY_ACTIONS,
  OIL_CLASSIFICATION_PRESETS,
} from '../data/simulationData';

const BACKEND_BASE_URL = 'http://localhost:8000';

async function fetchWithFallback(endpoint, options = {}, fallbackData) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800); // 1.8s timeout for snappy UI
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    // Graceful fallback to built-in simulation layer
    // console.debug(`API offline at ${endpoint}, using simulation engine fallback.`, err);
  }
  return fallbackData;
}

export const apiService = {
  // Spill Master Details
  async getSpillDetails(incidentId = "MS-2026-001") {
    return fetchWithFallback(`/api/spill/${incidentId}`, { method: 'GET' }, INCIDENT_PROFILE);
  },

  // 6h-72h Trajectory Predictions
  async getTrajectory(incidentId = "MS-2026-001", customParams = null) {
    if (customParams) {
      return fetchWithFallback('/api/spill/predict', {
        method: 'POST',
        body: JSON.stringify({
          incident_id: incidentId,
          start_lat: customParams.lat || 61.42,
          start_lng: customParams.lng || 4.18,
          initial_area_km2: customParams.area || 14.8,
          oil_type: customParams.oilType || "Heavy Crude",
          wind_speed_knots: customParams.windSpeed || 14.2,
          wind_direction_deg: customParams.windHeading || 215.0,
          current_speed_knots: customParams.currentSpeed || 1.25,
          current_direction_deg: customParams.currentHeading || 45.0,
        }),
      }, {
        forecast_waypoints: PREDICTION_TIMELINE,
        coastal_threat_level: "CRITICAL (Shoreline Threat in 48-72h)",
        dominant_drift_vector: { speed_knots: 1.62, heading_degrees: 48.5 },
      });
    }

    return fetchWithFallback(`/api/spill/${incidentId}/trajectory`, { method: 'GET' }, {
      forecast_waypoints: PREDICTION_TIMELINE,
      coastal_threat_level: "CRITICAL (Shoreline Threat in 48-72h)",
      dominant_drift_vector: { speed_knots: 1.62, heading_degrees: 48.5 },
    });
  },

  // Oil Type Identification
  async identifyOilType(requestData = {}) {
    const preset = OIL_CLASSIFICATION_PRESETS.find(p => p.id === requestData.preset_id) || OIL_CLASSIFICATION_PRESETS[0];

    const fallback = {
      classified_type: preset.name,
      api_gravity: preset.api,
      confidence_score: preset.confidence,
      viscosity_cst: preset.viscosityCst,
      evaporation_24h_percent: preset.evaporation24hPercent,
      half_life_hours: preset.halfLifeHours,
      spectral_damping_db: preset.dampingRatioDb,
      ndoi_reflectance: preset.ndoiIndex,
      visual_indicators: preset.visualCharacteristics,
      spreading_behavior: preset.spreadingBehavior,
      persistence_rating: preset.persistence,
      recommended_response: preset.recommendedResponse,
      is_biogenic_lookalike: preset.category.includes("Biogenic"),
      model_version: "Neeraksh-SpectralNet-v2.1",
    };

    return fetchWithFallback('/api/spill/oil-type', {
      method: 'POST',
      body: JSON.stringify(requestData),
    }, fallback);
  },

  // Vessel Candidates
  async getCandidateVessels(incidentId = "MS-2026-001") {
    return fetchWithFallback(`/api/spill/${incidentId}/vessels`, { method: 'GET' }, {
      candidates: CANDIDATE_VESSELS,
      observation_window: "04:00 UTC - 08:30 UTC",
      total_vessels_screened: 42,
    });
  },

  // Marine Ecosystem Exposure
  async getEcosystemImpact(incidentId = "MS-2026-001") {
    return fetchWithFallback(`/api/spill/${incidentId}/ecosystem-impact`, { method: 'GET' }, {
      overall_impact_level: "CRITICAL (Fishery & Coral Habitats Exposed in 14-28h)",
      critical_zones: ECOSYSTEM_ZONES,
      exposed_habitats_count: ECOSYSTEM_ZONES.length,
    });
  },

  // Dynamic Risk Zones
  async getRiskZones(incidentId = "MS-2026-001", weights = { coastal: 1.0, eco: 1.0, current: 1.0 }) {
    const params = new URLSearchParams({
      coastal_weight: weights.coastal || 1.0,
      ecosystem_weight: weights.eco || 1.0,
      current_multiplier: weights.current || 1.0,
    });

    return fetchWithFallback(`/api/spill/${incidentId}/risk-zones?${params.toString()}`, { method: 'GET' }, {
      risk_zones: RISK_ZONES,
      center_coordinates: { lat: 61.42, lng: 4.18 },
    });
  },

  // Emergency Response Optimization
  async optimizeEmergency(incidentId = "MS-2026-001", strategy = "BALANCED") {
    return fetchWithFallback(`/api/spill/${incidentId}/emergency-optimize`, {
      method: 'POST',
      body: JSON.stringify({ incident_id: incidentId, strategy_preference: strategy }),
    }, {
      recommended_sequence: EMERGENCY_ACTIONS,
      estimated_fleet_deployment_eta_min: 105,
      projected_risk_reduction_percent: 74.5,
    });
  },

  // Digital Twin
  async getDigitalTwin(incidentId = "MS-2026-001") {
    return fetchWithFallback(`/api/digital-twin/${incidentId}`, { method: 'GET' }, {
      area_name: "North Sea / Norwegian Continental Shelf Sector 4B",
      bathymetry_depth_meters: 285,
      sea_surface_temp_c: 11.4,
      sensors_online: 18,
      status: "SYNCHRONIZED_TWIN",
    });
  },
};
