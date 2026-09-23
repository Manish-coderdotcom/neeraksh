import React, { useState } from 'react';
import { 
  Cpu, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Droplet, 
  Activity, 
  ShieldAlert, 
  RefreshCw,
  Search,
  Eye
} from 'lucide-react';
import { OIL_CLASSIFICATION_PRESETS } from '../../data/simulationData';
import { apiService } from '../../services/api';

export default function OilIdentificationView() {
  const [selectedPresetId, setSelectedPresetId] = useState(OIL_CLASSIFICATION_PRESETS[0].id);
  const [customFile, setCustomFile] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState(null);

  const activePreset = OIL_CLASSIFICATION_PRESETS.find(p => p.id === selectedPresetId) || OIL_CLASSIFICATION_PRESETS[0];

  const handleSelectPreset = async (presetId) => {
    setSelectedPresetId(presetId);
    setCustomFile(null);
    setIsClassifying(true);
    const res = await apiService.identifyOilType({ preset_id: presetId });
    setTimeout(() => {
      setClassificationResult(res);
      setIsClassifying(false);
    }, 400);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomFile(file);
      setIsClassifying(true);
      setTimeout(async () => {
        const res = await apiService.identifyOilType({
          image_name: file.name,
          preset_id: "preset-heavy-crude",
        });
        setClassificationResult(res);
        setIsClassifying(false);
      }, 700);
    }
  };

  const currentResult = classificationResult || {
    classified_type: activePreset.name,
    api_gravity: activePreset.api,
    confidence_score: activePreset.confidence,
    viscosity_cst: activePreset.viscosityCst,
    evaporation_24h_percent: activePreset.evaporation24hPercent,
    half_life_hours: activePreset.halfLifeHours,
    spectral_damping_db: activePreset.dampingRatioDb,
    ndoi_reflectance: activePreset.ndoiIndex,
    visual_indicators: activePreset.visualCharacteristics,
    spreading_behavior: activePreset.spreadingBehavior,
    persistence_rating: activePreset.persistence,
    recommended_response: activePreset.recommendedResponse,
    is_biogenic_lookalike: activePreset.category.includes("Biogenic"),
    model_version: "Neeraksh-SpectralNet-v2.1",
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0f172a] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
              Multi-Spectral & Radar AI Classification
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Oil Type Identification & Physical Fingerprinting
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Convolutional neural network analyzing Synthetic Aperture Radar (SAR) backscatter suppression ratios and optical NDOI index to infer oil category.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-sky-950/60 border border-sky-800/50 text-sky-300 text-xs font-mono flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>MODEL: SPECTRALNET-2.1 (94.2% ACC)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload / Preset Selector + AI Inference Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Ingestion & Sensor Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Custom Image Upload Zone */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-xs text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-sky-400" />
              Upload Remote Sensing Imagery
            </h3>
            
            <label className="border-2 border-dashed border-slate-700/80 hover:border-sky-500/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-900/50 hover:bg-slate-900/80 group">
              <input 
                type="file" 
                accept="image/*,.tif,.tiff,.png,.jpg,.jpeg" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2 transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-200 block">
                {customFile ? customFile.name : "Drop Sentinel-1 / Drone Image or Browse"}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Supports GeoTIFF, SAR GRD, PNG, JPG (Simulated Inference)
              </span>
            </label>
          </div>

          {/* Benchmark Sensor Presets */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Benchmark Sensor Calibration Presets
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">4 Profiles</span>
            </div>

            <div className="space-y-2.5">
              {OIL_CLASSIFICATION_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id && !customFile;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#13233e] border-sky-500/80 shadow-sm ring-1 ring-sky-500/30"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-[#111c33]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{preset.category}</span>
                      <span className="text-[10px] font-mono text-sky-400">{preset.sampleType}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{preset.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: AI Inference & Fingerprint Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Classification Result Banner */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-5">
            
            {/* Header / Predicted Oil Category */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 block mb-0.5">
                  AI Neural Classification Output
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Droplet className={`w-6 h-6 ${currentResult.is_biogenic_lookalike ? "text-emerald-400" : "text-amber-400"}`} />
                  {currentResult.classified_type}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Confidence</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    {currentResult.confidence_score}%
                  </span>
                </div>
              </div>
            </div>

            {/* Spectral & Physical Indicators Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">API Gravity</span>
                <span className="text-white font-mono font-bold text-sm">{currentResult.api_gravity}</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Viscosity</span>
                <span className="text-amber-300 font-mono font-bold text-sm">{currentResult.viscosity_cst} cSt</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Radar Damping</span>
                <span className="text-sky-300 font-mono font-bold text-sm">{currentResult.spectral_damping_db} dB</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">24h Evaporation</span>
                <span className="text-rose-400 font-mono font-bold text-sm">{currentResult.evaporation_24h_percent}%</span>
              </div>
            </div>

            {/* Spreading & Weathering Characteristics */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-200 block mb-0.5">Visual & Radar Indicators:</span>
                <p className="text-slate-400 leading-relaxed">{currentResult.visual_indicators}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/60">
                <span className="font-semibold text-slate-200 block mb-0.5">Spreading & Persistence Profile:</span>
                <p className="text-slate-400 leading-relaxed">{currentResult.spreading_behavior}</p>
              </div>
            </div>

            {/* Recommended Tactical Response Protocol */}
            <div className="p-4 bg-sky-950/30 rounded-xl border border-sky-800/40 space-y-1.5 text-xs">
              <span className="font-semibold text-sky-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                Recommended Response Protocol Category:
              </span>
              <p className="text-slate-200 leading-relaxed font-sans">
                {currentResult.recommended_response}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Demonstration Notice */}
      <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Modular Architecture:</strong> The spectral inference layer is decoupled with a clean Python service interface. It currently runs deterministic multi-sensor demonstration models and can be directly connected to custom PyTorch/TensorRT deep-learning inference microservices.
        </span>
      </div>
    </div>
  );
}
