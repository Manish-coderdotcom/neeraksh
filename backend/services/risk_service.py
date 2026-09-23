"""
Dynamic Risk Zone Calculation Service
Computes multi-factor spatial risk envelopes around the active slick and trajectory.
"""

from typing import Dict, Optional
from backend.models import Coordinates, RiskZoneItem, RiskZonesResponse


def calculate_risk_zones(
    incident_id: str,
    weights: Optional[Dict[str, float]] = None
) -> RiskZonesResponse:
    w = weights or {
        "coastal_proximity": 1.0,
        "ecosystem_sensitivity": 1.0,
        "current_multiplier": 1.0,
    }

    # Dynamic adjustment based on weights
    r_red = round(8.0 * w.get("current_multiplier", 1.0), 1)
    r_orange = round(16.0 * w.get("current_multiplier", 1.0) * w.get("ecosystem_sensitivity", 1.0), 1)
    r_yellow = round(28.0 * w.get("coastal_proximity", 1.0), 1)
    r_green = round(45.0 * w.get("coastal_proximity", 1.0), 1)

    zones = [
        RiskZoneItem(
            tier="RED",
            name="Critical Impact Envelope",
            severity="CRITICAL",
            color="#ef4444",
            radius_nm=r_red,
            description="Active slick core and 0-12h immediate drift vector. Hydrocarbon thickness > 30 µm.",
            action_directive="Tier-1 Mechanical skimming, dynamic sweeping, and emergency vessel interception.",
            priority="P1 - Immediate Intervention",
        ),
        RiskZoneItem(
            tier="ORANGE",
            name="High Threat Corridor",
            severity="HIGH",
            color="#f97316",
            radius_nm=r_orange,
            description="12-24h hydrodynamic dispersion corridor. Sheen and weathered emulsion risk to fisheries.",
            action_directive="Enforce maritime navigation warning; close commercial fishing; pre-deploy containment booms.",
            priority="P2 - Pre-emptive Containment",
        ),
        RiskZoneItem(
            tier="YELLOW",
            name="Moderate Advisory Boundary",
            severity="MODERATE",
            color="#eab308",
            radius_nm=r_yellow,
            description="24-48h forecast boundary. Coastal protection preparation zone.",
            action_directive="Mobilize coastal wildlife response units; ready shoreline protection gear in Vestland ports.",
            priority="P3 - Staging & Readiness",
        ),
        RiskZoneItem(
            tier="GREEN",
            name="Low Risk / Observation Perimeter",
            severity="LOW",
            color="#10b981",
            radius_nm=r_green,
            description="48-72h outer contingency perimeter. Background water quality monitoring.",
            action_directive="Maintain satellite SAR monitoring and automated AIS radar corridor checks.",
            priority="P4 - Routine Surveillance",
        ),
    ]

    return RiskZonesResponse(
        incident_id=incident_id,
        center_coordinates=Coordinates(lat=61.42, lng=4.18),
        risk_zones=zones,
        calculation_weights=w,
        updated_at="2026-09-06T07:45:00Z",
    )
