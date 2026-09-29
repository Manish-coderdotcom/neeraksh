// Report Generation Service for Incident, Attribution, Impact, and Prediction dossiers

export class ReportService {
  generateReportText(type = 'INCIDENT', { incident, vessel, prediction, environment }) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    if (type === 'VESSEL_ATTRIBUTION') {
      return `================================================================================
NEERAKSH MARITIME INTELLIGENCE // VESSEL SOURCE ATTRIBUTION REPORT
OFFICIAL FORENSIC AIS & RADAR BACKSCATTER CORRELATION DOSSIER
================================================================================
REPORT ID:            ATTRIB-${incident?.id || 'INC-2026-0906'}-${vessel?.id?.toUpperCase() || 'SOLARA'}
TIMESTAMP:            ${timestamp}
STATUS:               PROBABILISTIC FORENSIC MATCH (91% CONFIDENCE)
INVESTIGATION LEAD:   INCOIS / Kystverket Joint Maritime Taskforce

--------------------------------------------------------------------------------
1. PRIMARY CANDIDATE VESSEL IDENTIFICATION
--------------------------------------------------------------------------------
Vessel Name:          ${vessel?.name || 'MV Solara'}
IMO Number:           ${vessel?.imo || '9384721'}
MMSI Number:          ${vessel?.mmsi || '419824190'}
Flag State:           ${vessel?.flag || 'Panama 🇵🇦'}
Vessel Type:          ${vessel?.type || 'Crude Oil Tanker'}
Deadweight Tonnage:   ${vessel?.dwt || '115,000 DWT'}
Length Overall:       ${vessel?.lengthMeters || 249} meters
Declared Destination: ${vessel?.destination || 'Rotterdam (NL)'}

--------------------------------------------------------------------------------
2. MULTI-FACTOR CORRELATION SCORING
--------------------------------------------------------------------------------
Composite Match:      ${vessel?.matchProbability || 91}% (RANK #1 CANDIDATE)
Track Intersection:   ${vessel?.trackOverlap || 94}% overlap with slick origin
Heading Correlation:  ${vessel?.headingCorrelation || 89}% alignment with drift vector
Proximity Score:      ${vessel?.proximityScore || 94} / 100
Transponder Gap:      ${vessel?.aisGapScore || 96} / 100 (2h blackout during leak onset)
Speed Anomaly Score:  ${vessel?.speedAnomalyScore || 84} / 100 (+6.2 kt acceleration)

--------------------------------------------------------------------------------
3. EMPIRICAL FORENSIC EVIDENCE LOG
--------------------------------------------------------------------------------
[EVIDENCE A] AIS BLACKOUT COINCIDENCE:
  Transponder was dark between 05:42 UTC and 07:42 UTC directly overlapping 
  the calculated slick leak onset coordinates (61.38° N, 04.12° E).

[EVIDENCE B] SPEED ACCELERATION ANOMALY:
  Upon transponder signal restoration at 07:42 UTC, vessel velocity jumped 
  from 11.0 knots to 17.4 knots (+6.2 knots delta), indicative of post-dumping flight.

[EVIDENCE C] SENTINEL-1 C-SAR HULL VERIFICATION:
  Radar backscatter reflects laden crude carrier displacement corresponding 
  to 115,000 DWT dimensions with dark capillary wave dampening trailing in stern wake.
================================================================================`;
    }

    if (type === 'ENVIRONMENTAL_IMPACT') {
      return `================================================================================
NEERAKSH MARITIME INTELLIGENCE // ENVIRONMENTAL IMPACT & HABITAT DOSSIER
ECOLOGICAL VULNERABILITY ASSESSMENT & RESOURCE ALLOCATION
================================================================================
REPORT ID:            EVAL-${incident?.id || 'INC-2026-0906'}-ECO
TIMESTAMP:            ${timestamp}
GEO-REGION:           Norwegian Continental Shelf / Sector 4B
CURRENT WIND:         ${environment?.wind?.description || '18 knots → NE'}
CURRENT DRIFT:        ${environment?.current?.description || '1.8 knots → SW'}

--------------------------------------------------------------------------------
1. CRITICAL HABITAT EXPOSURE TIMELINE
--------------------------------------------------------------------------------
1. Herring Spawning Ground #12:
   - ETA: 14 Hours
   - Vulnerability: CRITICAL ($18.4M commercial fishery clutches)
   - Threat: Acute embryonic cardiac toxicity in pelagic egg clutches.

2. Lophelia Coral Bioherm #4 (Cold-water reef 220m depth):
   - ETA: 28 Hours
   - Vulnerability: CRITICAL
   - Threat: Heavy hydrocarbon sedimentation risks benthic reef asphyxiation.

3. Vestland Coastal Nature Reserve (Ramsar Seabird Sanctuary):
   - ETA: 50 Hours (Landfall probability: 88.5% at 68h)
   - Threat: Outer Fedje archipelagic puffin & kittiwake feather hypothermia.

4. Sognefjord Aquaculture Zone:
   - ETA: 64 Hours
   - Threat: Commercial salmonid sea-pens gill necrosis and market condemnation.

--------------------------------------------------------------------------------
2. RECOMMENDED EMERGENCY COUNTERMEASURES
--------------------------------------------------------------------------------
- Deploy 2,400m heavy-duty Ro-Boom 2000 deflection barriers at Outer Fedje.
- Dispatch KV Bergen with high-capacity ocean brush skimmer barge.
- Activate pneumatic subsea bubble curtains around Lophelia coral bioherm.
- Strictly enforce 5 NM buffer zone prohibiting toxic chemical dispersants.
================================================================================`;
    }

    if (type === 'PREDICTION_REPORT') {
      return `================================================================================
NEERAKSH MARITIME INTELLIGENCE // HYDRODYNAMIC DRIFT FORECAST REPORT
0 TO 72-HOUR TRAJECTORY & SPREADING ENVELOPE
================================================================================
REPORT ID:            PRED-${incident?.id || 'INC-2026-0906'}-72H
TIMESTAMP:            ${timestamp}
PHYSICS MODEL:        Eulerian-Lagrangian Coupled Hydrodynamic Transport Engine
METEOROLOGY FEED:     ECMWF High-Resolution Atmospheric Wind Shear
OCEAN CURRENTS:       Copernicus Marine Environment Monitoring Service (CMEMS)

--------------------------------------------------------------------------------
FORECAST HORIZONS BREAKDOWN:
--------------------------------------------------------------------------------
T+0H (NOW):
  - Coordinates: 61.4200° N, 04.1800° E
  - Slick Area: 14.8 km² | Shoreline Distance: 38.4 NM | Landfall: 0.0%

T+24H:
  - Coordinates: 61.6200° N, 04.5800° E
  - Slick Area: 26.4 km² | Shoreline Distance: 21.5 NM | Landfall: 24.0%
  - Threat: Encroaching upon Outer Continental Shelf fisheries corridor.

T+48H:
  - Coordinates: 61.7400° N, 04.8200° E
  - Slick Area: 47.5 km² | Shoreline Distance: 11.2 NM | Landfall: 61.5%
  - Threat: High coastal threat alert; Fedje archipelago exclusion triggered.

T+72H:
  - Coordinates: 61.8800° N, 05.0800° E
  - Slick Area: 68.2 km² | Shoreline Distance: 3.8 NM | Landfall: 88.5%
  - Threat: Intertidal tar-ball deposition and critical shoreline ingress.
================================================================================`;
    }

    // Default: Comprehensive Incident Report
    return `================================================================================
NEERAKSH / TIDEMARK MARITIME INCIDENT EVIDENCE DOSSIER
OFFICIAL MARPOL ANNEX I ENVIRONMENTAL VIOLATION REPORT
================================================================================
INCIDENT ID:          ${incident?.id || 'INC-2026-0906'}
OFFICIAL CODE:        ${incident?.officialCode || 'IMO-NOR-2026-0906-S4B'}
TIMESTAMP:            ${timestamp}
DETECTION SOURCE:     Sentinel-1A C-band SAR (Pass: ${incident?.sarPassId || 'S1A_IW_GRDH_1SDV'})
LOCATION:             ${incident?.locationFormatted || '61.4200° N, 04.1800° E'}
JURISDICTION:         ${incident?.region || 'Norwegian Economic Exclusive Zone (Sector 4B)'}

--------------------------------------------------------------------------------
1. SLICK CHARACTERISTICS & ESTIMATED DISCHARGE
--------------------------------------------------------------------------------
Detection Time:       ${incident?.detectionTime || '2026-09-06 07:42:11 UTC'}
Estimated Onset:      ${incident?.estimatedOnset || '2026-09-06 05:42:00 UTC'}
Confidence Level:     ${incident?.confidence || '94%'} (Mineral Crude Oil Confirmed)
Estimated Slick Area: ${prediction?.slickAreaKm2 || incident?.baseAreaKm2 || 14.8} sq km
Estimated Volume:     ${incident?.estimatedVolume || '550 bbl (87.4 m³)'}
Oil Classification:   ${incident?.oilType || 'Heavy Crude Oil (19.4° API, 185 cSt)'}
SAR Radar Damping:    ${incident?.sarDampingDb || -11.4} dB in VV Polarization

--------------------------------------------------------------------------------
2. PRIMARY ATTRIBUTED RESPONSIBLE VESSEL
--------------------------------------------------------------------------------
Vessel Name:          ${vessel?.name || 'MV Solara'}
IMO Number:           ${vessel?.imo || '9384721'}
MMSI Number:          ${vessel?.mmsi || '419824190'}
Flag State:           ${vessel?.flag || 'Panama 🇵🇦'}
Vessel Type:          ${vessel?.type || 'Crude Oil Tanker'}
Attribution Score:    ${vessel?.matchProbability || 91}% (HIGH CONFIDENCE MATCH)
Distance from Spill:  ${vessel?.distanceFromSpill || '8.2 NM'}

Forensic Anomaly:
  Vessel turned off its AIS transponder for 2.0 hours during calculated leak onset
  and subsequently accelerated by +6.2 knots directly out of the discharge area.

--------------------------------------------------------------------------------
3. ENVIRONMENTAL & METEOROLOGICAL CONTEXT
--------------------------------------------------------------------------------
Wind:                 ${environment?.wind?.description || '18 knots → NE'}
Ocean Current:        ${environment?.current?.description || '1.8 knots → SW'}
Significant Waves:    ${environment?.waves?.description || '1.4 m'}
Sea Surface Temp:     ${environment?.temperature?.description || '11°C'}
Nearest Coastline:    ${prediction?.coastalDistanceNM || '38.4'} NM (Landfall Risk: ${prediction?.landfallProbability || 0}%)
================================================================================`;
  }

  downloadAsFile(filename, content, mimeType = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  exportJSON(data, filename = 'neeraksh-incident-data.json') {
    const jsonStr = JSON.stringify(data, null, 2);
    this.downloadAsFile(filename, jsonStr, 'application/json');
  }

  exportCSV(items, filename = 'neeraksh-telemetry.csv') {
    if (!items || !items.length) return;
    const keys = Object.keys(items[0]);
    const headerRow = keys.join(',');
    const rows = items.map(item =>
      keys.map(k => {
        const val = item[k];
        if (typeof val === 'object' && val !== null) {
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        }
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = [headerRow, ...rows].join('\n');
    this.downloadAsFile(filename, csvContent, 'text/csv');
  }

  triggerPrint(reportText) {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return false;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Neeraksh Incident Dossier</title>
          <style>
            body { font-family: monospace; padding: 24px; color: #000; background: #fff; font-size: 11px; line-height: 1.4; white-space: pre-wrap; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>${reportText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
    return true;
  }
}

export const reportService = new ReportService();
