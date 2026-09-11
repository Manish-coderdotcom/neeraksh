import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  KeyRound, 
  User, 
  Radar, 
  Satellite, 
  Radio, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Cpu, 
  Terminal,
  ArrowRight,
  Fingerprint,
  Award
} from 'lucide-react';

const REQUIRED_PASSWORD = 'SIH WINNER 2026';

export default function LoginPage({ onLogin }) {
  const [callsign, setCallsign] = useState('Commander-SIH');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState(0);

  const authSteps = [
    "Verifying Cryptographic Credentials...",
    "Connecting to Sentinel-1 SAR Uplink...",
    "Synchronizing Maritime AIS Live Gateway...",
    "Clearance Level-4 Confirmed. Access Granted!"
  ];

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    // Normalize comparison: trim whitespace and case-insensitive check for user convenience
    const normalizedInput = password.trim();
    if (normalizedInput.toUpperCase() !== REQUIRED_PASSWORD.toUpperCase()) {
      setErrorMessage(`ACCESS DENIED: Unauthorized clearance key. Required passcode is "${REQUIRED_PASSWORD}".`);
      return;
    }

    // Success flow with dynamic multi-stage loading simulation
    setIsAuthenticating(true);
    setAuthStep(0);

    const stepInterval = setInterval(() => {
      setAuthStep((prev) => {
        if (prev < authSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            onLogin({
              callsign: callsign.trim() || 'Commander-SIH',
              role: 'Chief Maritime Investigation Officer',
              clearance: 'Level-4 (Alpha)',
              passcodeVerified: REQUIRED_PASSWORD,
              loginTimestamp: new Date().toISOString(),
              rememberMe
            });
          }, 400);
          return prev;
        }
      });
    }, 280);
  };

  const handleAutoFill = () => {
    setPassword(REQUIRED_PASSWORD);
    setErrorMessage('');
  };

  const handleQuickDemoAccess = () => {
    setPassword(REQUIRED_PASSWORD);
    setErrorMessage('');
    setTimeout(() => {
      onLogin({
        callsign: 'Jury-Commander-2026',
        role: 'SIH Evaluator / Mission Director',
        clearance: 'Level-4 (Master Clearance)',
        passcodeVerified: REQUIRED_PASSWORD,
        loginTimestamp: new Date().toISOString(),
        rememberMe: true
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background Maritime Grid & Glow Effects */}
      <div className="absolute inset-0 bg-maritime-grid opacity-30 pointer-events-none" />
      
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-950/20 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Rotating Radar Circle behind form */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-cyan-500/10 rounded-full pointer-events-none hidden md:block">
        <div className="w-full h-full border border-cyan-500/10 rounded-full scale-75 animate-pulse" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-cyan-500/5 to-transparent animate-radar" />
      </div>

      {/* Top Telemetry Bar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-[#060d1b]/80 backdrop-blur-md px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 flex items-center justify-center">
            <Radar className="w-4 h-4 animate-spin-slow" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold tracking-wider text-white">NEERAKSH</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-semibold">TIDEMARK OPS</span>
          </div>
        </div>

        {/* SIH 2026 Special Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold tracking-wide">SMART INDIA HACKATHON 2026</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[10px] font-mono uppercase text-amber-200">WINNER ED.</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5 text-emerald-400" /> Sentinel-1 SAR: READY
          </span>
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" /> AIS Feeds: ACTIVE
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-blue-400" /> AES-256 GCM
          </span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">

          {/* Security Terminal Card */}
          <div className="glass-panel border border-cyan-800/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden backdrop-blur-xl bg-[#091426]/90">
            
            {/* Top Scanning Line Animation */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

            {/* Header / Crest */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-900/40 border border-cyan-400/40 text-cyan-400 mb-3.5 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white flex items-center justify-center gap-2">
                MISSION CONTROL
              </h2>
              <p className="text-xs sm:text-sm text-cyan-300/80 font-mono mt-1">
                Oil Spill Detection & Vessel Attribution System
              </p>
              
              <div className="mt-2.5 inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700/60 text-[11px] font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>RESTRICTED ACCESS · LEVEL 4 CLEARANCE</span>
              </div>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">

              {/* Callsign / User */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                  <span>Operator Callsign / ID</span>
                  <span className="text-[10px] text-cyan-400 lowercase font-normal">incois / coast guard</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-cyan-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    disabled={isAuthenticating}
                    placeholder="Enter callsign..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#060e1d] border border-slate-700/80 text-white font-mono text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Clearance Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Clearance Key (Password)</span>
                  </label>
                  
                  {/* Quick autofill helper */}
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Autofill Key</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Fingerprint className="w-4 h-4 text-cyan-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    disabled={isAuthenticating}
                    placeholder="Enter SIH password..."
                    className="w-full pl-10 pr-11 py-2.5 rounded-lg bg-[#060e1d] border border-slate-700/80 text-white font-mono text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all tracking-wider disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Hint Card */}
                <div className="mt-2 p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Required Passcode:</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="font-bold text-amber-300 hover:text-amber-200 tracking-wider bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded shadow-sm hover:border-amber-400 transition-all cursor-pointer"
                    title="Click to insert passcode"
                  >
                    SIH WINNER 2026
                  </button>
                </div>
              </div>

              {/* Remember Me & Station Session */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Persist workstation session</span>
                </label>
                <span className="text-[10px] text-slate-500">Secured Node</span>
              </div>

              {/* Error Message Display */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/70 border border-red-600/60 text-red-300 text-xs font-mono flex items-start gap-2.5 animate-bounce-short">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{errorMessage}</p>
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      className="mt-1 text-[11px] text-cyan-300 underline hover:text-cyan-200 font-bold block"
                    >
                      Click here to load "SIH WINNER 2026"
                    </button>
                  </div>
                </div>
              )}

              {/* Loading State Animation */}
              {isAuthenticating && (
                <div className="p-3.5 rounded-lg bg-cyan-950/70 border border-cyan-500/60 text-cyan-200 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
                      AUTHENTICATING MISSION CLEARANCE...
                    </span>
                    <span>{Math.min(100, Math.round(((authStep + 1) / authSteps.length) * 100))}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-full transition-all duration-300 ease-out"
                      style={{ width: `${((authStep + 1) / authSteps.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-cyan-300 italic">
                    › {authSteps[authStep]}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 px-4 rounded-xl font-display font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:from-cyan-300 hover:to-sky-200 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                <span>AUTHENTICATE & ACCESS MISSION CONTROL</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

            </form>

            {/* Quick Hackathon Demo Jury Access */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2.5">
                Evaluation & Demonstration Bypass
              </div>
              <button
                type="button"
                onClick={handleQuickDemoAccess}
                className="w-full py-2 px-3 rounded-lg bg-amber-950/30 hover:bg-amber-950/60 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>One-Click Jury Evaluation Access (SIH 2026)</span>
              </button>
            </div>

          </div>

          {/* Bottom Security Note */}
          <div className="mt-4 text-center text-slate-500 text-[11px] font-mono flex items-center justify-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-500" />
            <span>Neeraksh Sentinel-1 AIS Fusion Engine · SIH 2026</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#040813] border-t border-slate-800/80 py-3 px-6 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>TIDEMARK / NEERAKSH — Operational Maritime Security Node</span>
        </div>
        <div>
          Auth Gatekeeper: <span className="text-cyan-400 font-semibold">SIH WINNER 2026</span>
        </div>
      </footer>

    </div>
  );
}
