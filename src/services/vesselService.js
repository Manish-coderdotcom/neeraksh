import vesselsData from '../data/vessels.json';

export class VesselService {
  constructor() {
    this.vessels = vesselsData;
  }

  getAllVessels() {
    return [...this.vessels];
  }

  getVesselById(id) {
    return this.vessels.find(v => v.id.toLowerCase() === id.toLowerCase()) || null;
  }

  getAttributedVessels() {
    return [...this.vessels].sort((a, b) => b.matchProbability - a.matchProbability);
  }

  searchVessels(query) {
    if (!query || typeof query !== 'string') return this.vessels;
    const q = query.trim().toLowerCase();
    return this.vessels.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.imo.toLowerCase().includes(q) ||
      v.mmsi.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q) ||
      v.flag.toLowerCase().includes(q)
    );
  }

  filterVessels({ type, nearSpillOnly, maxDistanceNM, minMatchScore }) {
    return this.vessels.filter(v => {
      if (type && type !== 'ALL' && !v.type.toLowerCase().includes(type.toLowerCase())) {
        return false;
      }
      if (nearSpillOnly && v.distanceNM > (maxDistanceNM || 15.0)) {
        return false;
      }
      if (minMatchScore && v.matchProbability < minMatchScore) {
        return false;
      }
      return true;
    });
  }

  calculatePositionAtHorizon(vessel, horizonHours) {
    if (!vessel || !vessel.coordinates) return { lat: 61.42, lng: 4.18 };
    const h = typeof horizonHours === 'number' ? horizonHours : 0;
    if (h === 0) return vessel.coordinates;

    // Deterministic position advancement along heading vector
    const speedKnots = vessel.speedKnots || 14.0;
    const headingRad = ((vessel.headingDeg || 45) * Math.PI) / 180;
    const distanceNM = (speedKnots * h) * 0.4; // scaling factor for local observation box
    const deltaLat = (distanceNM / 60) * Math.cos(headingRad);
    const deltaLng = (distanceNM / (60 * Math.cos((vessel.coordinates.lat * Math.PI) / 180))) * Math.sin(headingRad);

    return {
      lat: Number((vessel.coordinates.lat + deltaLat).toFixed(4)),
      lng: Number((vessel.coordinates.lng + deltaLng).toFixed(4)),
    };
  }
}

export const vesselService = new VesselService();
