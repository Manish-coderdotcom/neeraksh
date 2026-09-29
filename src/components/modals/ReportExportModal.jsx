import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileJson, 
  FileSpreadsheet,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useMaritime } from '../../context/MaritimeContext';
import { reportService } from '../../services/reportService';

export default function ReportExportModal() {
  const { 
    activeModal, 
    closeModal, 
    currentIncident, 
    selectedVessel, 
    currentPrediction, 
    environment, 
    vessels,
    addToast 
  } = useMaritime();

  const [reportType, setReportType] = useState('INCIDENT');
  const [copied, setCopied] = useState(false);

  if (activeModal !== 'REPORT_EXPORT') return null;

  const reportPayload = {
    incident: currentIncident,
    vessel: selectedVessel,
    prediction: currentPrediction,
    environment,
  };

  const reportContent = reportService.generateReportText(reportType, reportPayload);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportContent);
    setCopied(true);
    addToast('Report content copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const filename = `neeraksh-${reportType.toLowerCase()}-${Date.now()}.txt`;
    reportService.downloadAsFile(filename, reportContent);
    addToast(`Downloaded ${filename}`, 'success');
  };

  const handleDownloadPDF = () => {
    reportService.triggerPrint(reportContent);
    addToast('Initiated PDF Print Engine', 'info');
  };

  const handleExportJSON = () => {
    reportService.exportJSON({
      incident: currentIncident,
      attributedVessel: selectedVessel,
      activeForecast: currentPrediction,
      metOcean: environment,
      candidateVessels: vessels,
      generatedAt: new Date().toISOString(),
    });
    addToast('Exported complete incident JSON', 'success');
  };

  const handleExportCSV = () => {
    reportService.exportCSV(vessels, `neeraksh-vessels-telemetry-${Date.now()}.csv`);
    addToast('Exported vessel telemetry CSV', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0b1325] border border-sky-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0f1a33]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                  Official Maritime Evidence Pack
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  MARPOL Annex I
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Reports & Export Generation Center
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Type Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 px-6 pt-4 pb-2 border-b border-slate-800/80 bg-[#0c162b]">
          {[
            { id: 'INCIDENT', label: 'Incident Report' },
            { id: 'VESSEL_ATTRIBUTION', label: 'Vessel Attribution Report' },
            { id: 'ENVIRONMENTAL_IMPACT', label: 'Environmental Impact Report' },
            { id: 'PREDICTION_REPORT', label: 'Prediction Report' },
          ].map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => setReportType(type.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                reportType === type.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Report Preview Window */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>PREVIEW: {reportType}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
          </div>

          <div className="bg-[#060b14] border border-slate-800 rounded-xl p-4 font-mono text-[11px] leading-relaxed text-slate-300 max-h-[380px] overflow-y-auto whitespace-pre select-text selection:bg-sky-500/30">
            {reportContent}
          </div>
        </div>

        {/* Export Actions Bar */}
        <div className="p-4 bg-[#0a1122] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700/80"
            >
              <FileJson className="w-4 h-4 text-amber-400" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-700/80"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              <span>Raw TXT</span>
            </button>

            <button
              type="button"
              onClick={closeModal}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
