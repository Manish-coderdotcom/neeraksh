// Simulation Engine Service
// Orchestrates deterministic 9-step maritime incident simulation workflow

export const SIMULATION_STEPS = [
  {
    step: 1,
    title: "SAR Satellite Ingestion",
    message: "Analyzing Sentinel-1 SAR imagery...",
    subtext: "Ingesting ESA Copernicus C-SAR IW mode radar swath (5m resolution, VV+VH).",
    durationMs: 900,
  },
  {
    step: 2,
    title: "Oil Spill Detected",
    message: "Oil spill detected at 61.4200° N, 04.1800° E.",
    subtext: "U-Net neural segmentation confirms 14.8 km² crude slick with -11.4 dB radar damping.",
    durationMs: 800,
  },
  {
    step: 3,
    title: "AIS Correlation Commenced",
    message: "AIS correlation starts.",
    subtext: "Cross-referencing 42 historical vessel trajectories within 50 NM bounding box.",
    durationMs: 800,
  },
  {
    step: 4,
    title: "Source Vessels Identified",
    message: "Potential source vessels are identified.",
    subtext: "Bayesian scoring isolates MV Solara (91% match) with 2h transponder gap at leak onset.",
    durationMs: 900,
  },
  {
    step: 5,
    title: "Atmospheric & Ocean Physics",
    message: "Ocean current + wind simulation starts.",
    subtext: "Fusing ECMWF 18 kt NE winds and Copernicus 1.8 kt SW surface currents into Fay's transport model.",
    durationMs: 800,
  },
  {
    step: 6,
    title: "24-Hour Forecast Generated",
    message: "24-hour prediction generated.",
    subtext: "Slick projected to expand to 26.4 km²; drift heading 052° towards outer continental shelf.",
    durationMs: 800,
  },
  {
    step: 7,
    title: "48-Hour Forecast Generated",
    message: "48-hour prediction generated.",
    subtext: "Slick area reaches 47.5 km²; shoreline proximity drops to 11.2 NM, triggering coastal threat alert.",
    durationMs: 800,
  },
  {
    step: 8,
    title: "Ecosystem Risk Assessment",
    message: "Environmental risk calculated.",
    subtext: "Lophelia coral bioherm (ETA 28h) and Herring spawning grounds (ETA 14h) flagged as CRITICAL.",
    durationMs: 800,
  },
  {
    step: 9,
    title: "Final Dossier Compiled",
    message: "Final incident report generated.",
    subtext: "Comprehensive legal evidence package & IMO MARPOL Annex I violation dossier compiled.",
    durationMs: 600,
  }
];

export class SimulationService {
  constructor() {
    this.activeRun = null;
  }

  runSimulation({ onStepProgress, onComplete, onError }) {
    if (this.activeRun) {
      this.cancel();
    }

    let currentStepIndex = 0;
    let isCancelled = false;

    this.activeRun = {
      cancel: () => {
        isCancelled = true;
      }
    };

    const executeNextStep = () => {
      if (isCancelled) return;

      if (currentStepIndex >= SIMULATION_STEPS.length) {
        if (onComplete) onComplete();
        this.activeRun = null;
        return;
      }

      const stepData = SIMULATION_STEPS[currentStepIndex];
      const progressPercent = Math.round(((currentStepIndex + 1) / SIMULATION_STEPS.length) * 100);

      if (onStepProgress) {
        onStepProgress({
          step: stepData.step,
          totalSteps: SIMULATION_STEPS.length,
          title: stepData.title,
          message: stepData.message,
          subtext: stepData.subtext,
          progress: progressPercent,
        });
      }

      currentStepIndex += 1;
      setTimeout(executeNextStep, stepData.durationMs);
    };

    executeNextStep();
    return this.activeRun;
  }

  cancel() {
    if (this.activeRun) {
      this.activeRun.cancel();
      this.activeRun = null;
    }
  }
}

export const simulationService = new SimulationService();
