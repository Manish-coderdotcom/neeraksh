"""
Hydrodynamic Oil Spill Trajectory and Expansion Simulation Service
Combines wind vector drift, tidal ocean current, Coriolis effect, and Fay's gravity-viscous expansion.
"""

import math
from typing import List, Dict, Any
from backend.models import Coordinates, TrajectoryWaypoint, SpillPredictResponse


def simulate_trajectory(
    incident_id: str,
    start_lat: float,
    start_lng: float,
    initial_area_km2: float,
    oil_type: str,
    wind_speed_knots: float,
    wind_direction_deg: float,
    current_speed_knots: float,
    current_direction_deg: float,
    forecast_hours: List[int] = [0, 6, 12, 24, 48, 72]
) -> SpillPredictResponse:
    """
    Computes forecasted trajectory waypoints based on hydrodynamic forces.
    """
    # Wind drift coefficient (standard NOAA / IMO empirical value: 3.0% to 3.5%)
    wind_factor = 0.032
    # Coriolis deflection: in northern hemisphere, surface wind drift is deflected ~20 deg right
    wind_drift_angle_rad = math.radians((wind_direction_deg + 20) % 360)
    current_angle_rad = math.radians(current_direction_deg % 360)

    # Net drift velocity vector (knots)
    u_current = current_speed_knots * math.sin(current_angle_rad)
    v_current = current_speed_knots * math.cos(current_angle_rad)

    u_wind = (wind_speed_knots * wind_factor) * math.sin(wind_drift_angle_rad)
    v_wind = (wind_speed_knots * wind_factor) * math.cos(wind_drift_angle_rad)

    u_net = u_current + u_wind
    v_net = v_current + v_wind

    net_speed_knots = math.sqrt(u_net**2 + v_net**2)
    net_heading_deg = (math.degrees(math.atan2(u_net, v_net)) + 360) % 360

    # 1 NM = 1.852 km. 1 degree latitude ~= 60 NM. 1 degree longitude ~= 60 * cos(lat) NM.
    mean_lat_rad = math.radians(start_lat)
    nm_per_deg_lat = 60.0
    nm_per_deg_lng = 60.0 * math.cos(mean_lat_rad)

    waypoints = []
    initial_volume = 550.0  # bbl

    for h in forecast_hours:
        # Distance drifted in nautical miles: speed (knots) * hours
        dist_drift_nm = net_speed_knots * h
        delta_lat = (dist_drift_nm * math.cos(math.radians(net_heading_deg))) / nm_per_deg_lat
        delta_lng = (dist_drift_nm * math.sin(math.radians(net_heading_deg))) / nm_per_deg_lng

        cur_lat = round(start_lat + delta_lat, 4)
        cur_lng = round(start_lng + delta_lng, 4)

        # Fay's gravity-viscous expansion: A(t) = A0 * (1 + alpha * t^0.75)
        expansion_factor = 1.0 + 0.35 * (h ** 0.75) if h > 0 else 1.0
        cur_area = round(initial_area_km2 * expansion_factor, 1)

        # Weathering: Evaporation and emulsification
        evaporation_pct = min(42.0, 4.0 + (h ** 0.65) * 4.8) if h > 0 else 4.2
        emulsified_pct = min(88.0, 12.0 + (h ** 0.8) * 5.2) if h > 0 else 12.0
        vol_remaining = round(initial_volume * (1.0 - evaporation_pct / 100.0), 0)
        thickness_microns = round(max(8.0, 50.0 / (expansion_factor ** 0.6)), 1)

        # Coastal distance estimation (Norwegian coast line near lng 5.3)
        coastal_distance_nm = max(2.5, round(38.4 - (dist_drift_nm * 0.72), 1))
        landfall_prob = min(92.0, max(0.0, (72 - coastal_distance_nm) * 1.5)) if h > 0 else 0.0
        confidence = max(68.0, round(96.0 - (h * 0.35), 0))

        if h == 0:
            status_text = "SAR Ingestion & Primary Localization"
        elif h <= 6:
            status_text = "Spreading & Weathering Phase"
        elif h <= 12:
            status_text = "Emulsification & Viscosity Increase"
        elif h <= 24:
            status_text = "Approaching Herring Fishery Grounds"
        elif h <= 48:
            status_text = "High Proximity to Vestland Coastal MPA"
        else:
            status_text = "Shoreline Ingress & Fjord Barrier Engagement"

        waypoints.append(
            TrajectoryWaypoint(
                horizon_key=f"{h}H" if h > 0 else "0H",
                hours=h,
                time_utc=f"+{h}H Forecast" if h > 0 else "07:42 UTC (NOW)",
                coordinates=Coordinates(lat=cur_lat, lng=cur_lng),
                slick_area_km2=cur_area,
                thickness_microns=thickness_microns,
                volume_remaining_bbl=vol_remaining,
                coastal_distance_nm=coastal_distance_nm,
                landfall_probability=round(landfall_prob, 1),
                confidence_percent=confidence,
                drift_speed_knots=round(net_speed_knots, 2),
                drift_heading_deg=round(net_heading_deg, 1),
                status_text=status_text,
            )
        )

    return SpillPredictResponse(
        incident_id=incident_id,
        simulation_model="Neeraksh HydroDynamic-Euler-2.4",
        forecast_waypoints=waypoints,
        coastal_threat_level="CRITICAL (Shoreline Threat in 48-72h)",
        dominant_drift_vector={
            "speed_knots": round(net_speed_knots, 2),
            "heading_degrees": round(net_heading_deg, 1),
            "wind_component_knots": round(wind_speed_knots * wind_factor, 2),
            "current_component_knots": current_speed_knots,
        },
        disclaimer="DECISION-SUPPORT SIMULATION ONLY. Results are computed via hydrodynamic vector integration and do not guarantee exact physical slick movement.",
    )
