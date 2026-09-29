// Environmental telemetry service
import envData from '../data/environmental.json';

export class EnvironmentService {
  constructor() {
    this.data = envData;
  }

  getCurrentConditions(horizonKey = '0H') {
    const horizon = this.data.horizonConditions[horizonKey] || this.data.horizonConditions['0H'];
    return {
      wind: {
        speedKnots: horizon.windSpeed,
        headingDeg: horizon.windHeading,
        direction: horizon.windDirection,
        description: `${horizon.windSpeed} knots → ${horizon.windDirection}`,
      },
      current: {
        speedKnots: horizon.currentSpeed,
        headingDeg: horizon.currentHeading,
        direction: horizon.currentDirection,
        description: `${horizon.currentSpeed} knots → ${horizon.currentDirection}`,
      },
      waves: {
        heightMeters: horizon.waveHeight,
        description: `${horizon.waveHeight} m`,
      },
      temperature: {
        seaSurfaceC: horizon.seaTemp,
        description: `${Math.round(horizon.seaTemp)}°C`,
      },
      atmosphere: this.data.atmosphere,
    };
  }

  calculateDynamicRiskLevel({ windSpeed, currentSpeed, shorelineDistanceNM, protectedAreasCount }) {
    let score = 50;
    if (windSpeed > 18) score += 15;
    if (currentSpeed > 1.5) score += 15;
    if (shorelineDistanceNM < 20) score += 20;
    if (protectedAreasCount > 2) score += 15;

    if (score >= 80) return { level: 'HIGH', color: '#ef4444', label: 'CRITICAL ENVIRONMENTAL RISK' };
    if (score >= 50) return { level: 'MEDIUM', color: '#f97316', label: 'ELEVATED REGIONAL RISK' };
    return { level: 'LOW', color: '#eab308', label: 'MODERATE LOCAL RISK' };
  }
}

export const environmentService = new EnvironmentService();
