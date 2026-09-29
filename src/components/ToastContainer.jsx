import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useMaritime } from '../context/MaritimeContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useMaritime();

  if (!toasts || !toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isCritical = toast.type === 'critical' || toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-fadeIn ${
              isCritical
                ? 'bg-[#180a0e]/95 border-rose-500/80 text-rose-200'
                : isWarning
                ? 'bg-[#1c1306]/95 border-amber-500/80 text-amber-200'
                : isSuccess
                ? 'bg-[#081812]/95 border-emerald-500/80 text-emerald-200'
                : 'bg-[#091326]/95 border-sky-500/70 text-slate-200'
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              {isCritical ? (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : isWarning ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs font-sans leading-snug">
                <span className="font-semibold block text-[11px] uppercase tracking-wider opacity-80 mb-0.5">
                  Maritime Tactical Alert
                </span>
                <span className="font-medium">{toast.message}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
