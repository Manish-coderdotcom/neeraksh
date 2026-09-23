"""
Pydantic Data Models for Neeraksh Marine Intelligence Backend API
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class Coordinates(BaseModel):
    lat: float = Field(..., description="Latitude in decimal degrees")
    lng: float = Field(..., description="Longitude in decimal degrees")


class SpillDetectRequest(BaseModel):
    satellite_pass_id: Optional[str] = "S1A_IW_GRDH_1SDV_20260906T074211"
    bounding_box: Optional[List[float]] = Field(None, description="[min_lat, min_lng, max_lat, max_lng]")
    confidence_threshold: float = 0.75
    sensor_type: str = "SAR_C_BAND"


class SpillDetectResponse(BaseModel):
    incident_id: str
    detected: bool
    coordinates: Coordinates
    area_km2: float
    confidence_score: float
    detection_time: str
    sensor: str
    preliminary_slick_type: str
    status: str


class SpillPredictRequest(BaseModel):
    incident_id: str = "MS-2026-001"
    start_lat: float = 61.42
    start_lng: float = 4.18
    initial_area_km2: float = 14.8
    oil_type: str = "Heavy Crude"
    wind_speed_knots: float = 14.2
    wind_direction_deg: float = 215.0
    current_speed_knots: float = 1.25
    current_direction_deg: float = 45.0
    wave_height_meters: float = 1.2
    sea_temperature_c: float = 11.4
    forecast_hours: List[int] = [0, 6, 12, 24, 48, 72]


class TrajectoryWaypoint(BaseModel):
    horizon_key: str
    hours: int
    time_utc: str
    coordinates: Coordinates
    slick_area_km2: float
    thickness_microns: float
    volume_remaining_bbl: float
    coastal_distance_nm: float
    landfall_probability: float
    confidence_percent: float
    drift_speed_knots: float
    drift_heading_deg: float
    status_text: str


class SpillPredictResponse(BaseModel):
    incident_id: str
    simulation_model: str
    forecast_waypoints: List[TrajectoryWaypoint]
    coastal_threat_level: str
    dominant_drift_vector: Dict[str, Any]
    disclaimer: str


class SpillDetailResponse(BaseModel):
    incident_id: str
    official_code: str
    name: str
    region: str
    coordinates: Coordinates
    detection_time_utc: str
    estimated_onset_utc: str
    current_area_km2: float
    estimated_volume_bbl: float
    oil_type: str
    confidence_score: float
    sea_state: str
    sea_temp_c: float
    wind: str
    current: str
    status: str



class OilTypeIdentifyRequest(BaseModel):
    image_name: Optional[str] = "sar_sample_01.png"
    sensor_mode: Optional[str] = "Sentinel-1 SAR C-Band"
    observed_damping_db: Optional[float] = -11.4
    ndoi_index: Optional[float] = 0.68
    temperature_delta_c: Optional[float] = -0.85
    preset_id: Optional[str] = None


class OilTypeIdentifyResponse(BaseModel):
    classified_type: str
    api_gravity: str
    confidence_score: float
    viscosity_cst: float
    evaporation_24h_percent: float
    half_life_hours: float
    spectral_damping_db: float
    ndoi_reflectance: float
    visual_indicators: str
    spreading_behavior: str
    persistence_rating: str
    recommended_response: str
    is_biogenic_lookalike: bool
    model_version: str


class RiskZoneItem(BaseModel):
    tier: str
    name: str
    severity: str
    color: str
    radius_nm: float
    description: str
    action_directive: str
    priority: str


class RiskZonesResponse(BaseModel):
    incident_id: str
    center_coordinates: Coordinates
    risk_zones: List[RiskZoneItem]
    calculation_weights: Dict[str, float]
    updated_at: str


class EcosystemExposureItem(BaseModel):
    id: str
    name: str
    category: str
    coordinates: Coordinates
    depth_meters: float
    area_hectares: float
    vulnerability_level: str
    risk_color: str
    distance_from_spill_nm: float
    time_to_potential_exposure_hours: float
    key_species: List[str]
    potential_impact: str
    recommended_protection: str


class EcosystemImpactResponse(BaseModel):
    incident_id: str
    overall_impact_level: str
    exposed_habitats_count: int
    critical_zones: List[EcosystemExposureItem]
    fisheries_exposure_summary: str
    marine_mammal_advisory: str
    disclaimer: str


class VesselCandidateItem(BaseModel):
    id: str
    name: str
    type: str
    flag: str
    mmsi: str
    imo: str
    current_position: str
    speed_knots: float
    heading_deg: int
    distance_from_spill_nm: float
    time_near_spill_utc: str
    trajectory_match_percent: float
    correlation_score: int
    rank: int
    role: str
    scores: Dict[str, int]
    transponder_gap_details: str
    anomaly_summary: str
    sar_match: str


class VesselsResponse(BaseModel):
    incident_id: str
    observation_window: str
    total_vessels_screened: int
    candidates: List[VesselCandidateItem]
    neutrality_disclaimer: str


class EmergencyOptimizeRequest(BaseModel):
    incident_id: str = "MS-2026-001"
    available_units: Optional[List[str]] = None
    strategy_preference: str = "BALANCED"  # RAPID_CONTAINMENT, SHORELINE_DEFENSE, BALANCED


class EmergencyActionItem(BaseModel):
    id: str
    priority: str
    priority_label: str
    title: str
    target_entity: str
    location: str
    assigned_asset: str
    eta_minutes: int
    distance_nm: float
    required_resources: str
    estimated_containment_efficiency: str
    status: str


class EmergencyOptimizeResponse(BaseModel):
    incident_id: str
    strategy_mode: str
    recommended_sequence: List[EmergencyActionItem]
    estimated_fleet_deployment_eta_min: int
    projected_risk_reduction_percent: float
    disclaimer: str


class DigitalTwinLayer(BaseModel):
    layer_id: str
    label: str
    enabled_default: bool
    feature_count: int
    last_telemetry_sync: str


class DigitalTwinResponse(BaseModel):
    incident_id: str
    area_name: str
    center_coordinates: Coordinates
    bathymetry_depth_meters: int
    sea_surface_temp_c: float
    wind_vector: Dict[str, Any]
    current_vector: Dict[str, Any]
    active_layers: List[DigitalTwinLayer]
    sensors_online: int
    status: str
