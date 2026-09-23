"""
Marine Ecosystem Exposure Evaluation Service
"""

from typing import List
from backend.models import Coordinates, EcosystemExposureItem, EcosystemImpactResponse


def get_ecosystem_impact(incident_id: str) -> EcosystemImpactResponse:
    zones = [
        EcosystemExposureItem(
            id="eco-1",
            name="Lophelia Coral Bioherm #4",
            category="Cold-Water Coral Reef",
            coordinates=Coordinates(lat=61.72, lng=4.78),
            depth_meters=220.0,
            area_hectares=1420.0,
            vulnerability_level="CRITICAL",
            risk_color="#ef4444",
            distance_from_spill_nm=18.2,
            time_to_potential_exposure_hours=28.0,
            key_species=["Lophelia pertusa", "Gorgonian Sea Fans", "Deep-sea Sponges"],
            potential_impact="Irreversible smothering of fragile scleractinian skeleton polyps; toxic hydrocarbon accumulation in benthic bioherm.",
            recommended_protection="Deploy deep-water subsea deflection curtains; prohibit chemical dispersant application in 5 NM buffer zone.",
        ),
        EcosystemExposureItem(
            id="eco-2",
            name="North Sea Herring Spawning Ground #12",
            category="Commercial Fishery & Nursery",
            coordinates=Coordinates(lat=61.58, lng=4.52),
            depth_meters=140.0,
            area_hectares=3850.0,
            vulnerability_level="CRITICAL",
            risk_color="#ef4444",
            distance_from_spill_nm=10.5,
            time_to_potential_exposure_hours=14.0,
            key_species=["Clupea harengus (Herring)", "Gadus morhua (Atlantic Cod)", "Ammodytidae (Sand lance)"],
            potential_impact="Embryonic toxicity in pelagic egg clutches; commercial catch ban required across Sector 4B to prevent human consumption of tainted seafood.",
            recommended_protection="Pre-emptive acoustic deterrent deployment; issue emergency fishing exclusion notice to regional trawler fleet.",
        ),
        EcosystemExposureItem(
            id="eco-3",
            name="Vestland Coastal Nature Reserve & Bird Colonies",
            category="Marine Protected Area (MPA)",
            coordinates=Coordinates(lat=61.92, lng=5.10),
            depth_meters=45.0,
            area_hectares=5600.0,
            vulnerability_level="HIGH",
            risk_color="#f97316",
            distance_from_spill_nm=32.4,
            time_to_potential_exposure_hours=50.0,
            key_species=["Fratercula arctica (Atlantic Puffin)", "Rissa tridactyla (Kittiwake)", "Phoca vitulina (Harbor Seal)"],
            potential_impact="Severe feather hypothermia and ingestion fatality in cliff nesting seabird populations; haul-out site contamination.",
            recommended_protection="Pre-position 2,400m coastal deflection booms across outer skerries; mobilize wildlife rehabilitation field hospitals.",
        ),
        EcosystemExposureItem(
            id="eco-4",
            name="Sognefjord Pelagic Aquaculture Zone",
            category="Salmonid Aquaculture Facilities",
            coordinates=Coordinates(lat=61.12, lng=5.05),
            depth_meters=85.0,
            area_hectares=890.0,
            vulnerability_level="MODERATE",
            risk_color="#eab308",
            distance_from_spill_nm=35.8,
            time_to_potential_exposure_hours=64.0,
            key_species=["Salmo salar (Atlantic Salmon)", "Sea Trout"],
            potential_impact="Smothering of sea-cage net pens; heavy economic loss to commercial aquaculture operators.",
            recommended_protection="Activate fjord mouth bubble curtains and surface skimmer barricades.",
        ),
        EcosystemExposureItem(
            id="eco-5",
            name="Minke Whale Migration Corridor",
            category="Marine Mammal Sanctuary",
            coordinates=Coordinates(lat=61.35, lng=3.85),
            depth_meters=310.0,
            area_hectares=9400.0,
            vulnerability_level="LOW",
            risk_color="#10b981",
            distance_from_spill_nm=14.6,
            time_to_potential_exposure_hours=999.0,
            key_species=["Balaenoptera acutorostrata (Minke Whale)", "Phocoena phocoena (Harbor Porpoise)"],
            potential_impact="Located updrift of prevailing surface current; minimal immediate exposure risk unless wind reverses to northerly quadrant.",
            recommended_protection="Continuous passive acoustic hydrophone monitoring.",
        ),
    ]

    return EcosystemImpactResponse(
        incident_id=incident_id,
        overall_impact_level="CRITICAL (Fishery & Coral Habitats Exposed in 14-28h)",
        exposed_habitats_count=len(zones),
        critical_zones=zones,
        fisheries_exposure_summary="140 km² of prime Herring spawning grounds directly down-drift. Estimated economic exposure: $18.4M if unmitigated.",
        marine_mammal_advisory="Updrift buffer intact; acoustic telemetry indicates 3 Minke pods safely west of trajectory cone.",
        disclaimer="DECISION-SUPPORT SIMULATION ONLY. Impact levels indicate modeled exposure risks and do not replace biological field sampling.",
    )
