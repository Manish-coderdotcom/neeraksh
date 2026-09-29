// AIS Stream & Telemetry Fusion Service
import vesselsData from '../data/vessels.json';

export class AisService {
  constructor() {
    this.streamFrequencyHz = 1.0;
    this.status = 'ACTIVE';
  }

  getStreamStatus() {
    return {
      status: this.status,
      frequency: `${this.streamFrequencyHz} Hz`,
      activeTrackCount: vesselsData.length,
      lastSync: new Date().toISOString(),
      coverageArea: "North Sea Sector 4B (Norwegian EEZ)",
    };
  }

  getVesselTracks() {
    return vesselsData.map(v => ({
      id: v.id,
      name: v.name,
      mmsi: v.mmsi,
      trail: v.trail,
      statusBadge: v.statusBadge,
    }));
  }

  detectTransponderGaps(vesselId) {
    const vessel = vesselsData.find(v => v.id === vesselId);
    if (!vessel) return null;

    if (vessel.id === 'solara') {
      return {
        gapFound: true,
        durationMinutes: 120,
        gapStart: "05:42 UTC",
        gapEnd: "07:42 UTC",
        distanceDriftedNM: 18.2,
        speedJumpKnots: 6.2,
        severity: "CRITICAL",
        detail: "Complete AIS transponder blackout across estimated spill origin coordinates.",
      };
    }

    return {
      gapFound: false,
      durationMinutes: 0,
      severity: "NORMAL",
      detail: "Continuous compliant AIS broadcasting.",
    };
  }
}

export const aisService = new AisService();
