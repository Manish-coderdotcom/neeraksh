import predictionsData from '../data/predictions.json';

export class SpillPredictionService {
  constructor() {
    this.predictions = predictionsData;
  }

  getAllHorizons() {
    return [...this.predictions];
  }

  getPredictionByHorizon(horizonKey) {
    return this.predictions.find(p => p.horizonKey === horizonKey) || this.predictions[0];
  }

  calculateDeterministicState(horizonHours = 0, incidentOrigin = { lat: 61.42, lng: 4.18 }) {
    // Exact mapping or continuous interpolation
    const exact = this.predictions.find(p => p.hours === horizonHours);
    if (exact) return exact;

    // Find bounding horizons
    let lower = this.predictions[0];
    let upper = this.predictions[this.predictions.length - 1];

    for (let i = 0; i < this.predictions.length - 1; i++) {
      if (horizonHours >= this.predictions[i].hours && horizonHours <= this.predictions[i + 1].hours) {
        lower = this.predictions[i];
        upper = this.predictions[i + 1];
        break;
      }
    }

    const span = upper.hours - lower.hours || 1;
    const t = Math.max(0, Math.min(1, (horizonHours - lower.hours) / span));

    return {
      horizonKey: `${horizonHours}H`,
      label: `+${horizonHours}H`,
      hours: horizonHours,
      timeUTC: lower.timeUTC,
      coordinates: {
        lat: Number((lower.coordinates.lat + (upper.coordinates.lat - lower.coordinates.lat) * t).toFixed(4)),
        lng: Number((lower.coordinates.lng + (upper.coordinates.lng - lower.coordinates.lng) * t).toFixed(4)),
      },
      slickAreaKm2: Number((lower.slickAreaKm2 + (upper.slickAreaKm2 - lower.slickAreaKm2) * t).toFixed(1)),
      slickVolumeBbl: Math.round(lower.slickVolumeBbl + (upper.slickVolumeBbl - lower.slickVolumeBbl) * t),
      coastalDistanceNM: Number((lower.coastalDistanceNM + (upper.coastalDistanceNM - lower.coastalDistanceNM) * t).toFixed(1)),
      landfallProbability: Number((lower.landfallProbability + (upper.landfallProbability - lower.landfallProbability) * t).toFixed(1)),
      driftSpeedKnots: Number((lower.driftSpeedKnots + (upper.driftSpeedKnots - lower.driftSpeedKnots) * t).toFixed(2)),
      driftHeadingDeg: Math.round(lower.driftHeadingDeg + (upper.driftHeadingDeg - lower.driftHeadingDeg) * t),
      environmentalRisk: upper.environmentalRisk,
      riskTier: upper.riskTier,
      polygonScale: Number((lower.polygonScale + (upper.polygonScale - lower.polygonScale) * t).toFixed(2)),
      futureImpacts: upper.futureImpacts,
    };
  }
}

export const spillPredictionService = new SpillPredictionService();
