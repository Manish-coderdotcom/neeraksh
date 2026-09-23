import React, { useState } from 'react';
import {
  ShieldAlert,
  KeyRound,
  User,
  Satellite,
  Radio,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Cpu,
  ArrowRight,
  Fingerprint,
  Award
} from 'lucide-react';

const REQUIRED_PASSWORD = 'SIH WINNER 2026';

export default function LoginPage({ onLogin }) {
  const [callsign, setCallsign] = useState('Commander-SIH');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = us
  eState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState(0);

  const authSteps = [
    "Verifying operator credentials...",
    "Connecting to Sentinel-1 SAR downlink...",
    "Synchronizing AIS maritime tracking stream...",
    "Session verified. Access granted."
  ];

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    const normalizedInput = password.trim();
    if (normalizedInput.toUpperCase() !== REQUIRED_PASSWORD.toUpperCase()) {
      setErrorMessage(`Invalid credentials. Required passcode is "${REQUIRED_PASSWORD}".`);
      return;
    }

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
              clearance: 'Level-4 Operational',
              passcodeVerified: REQUIRED_PASSWORD,
              loginTimestamp: new Date().toISOString(),
              rememberMe
            });
          }, 350);
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
        clearance: 'Level-4 Operational',
        passcodeVerified: REQUIRED_PASSWORD,
        loginTimestamp: new Date().toISOString(),
        rememberMe: true
      });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-between relative selection:bg-sky-500/30 selection:text-sky-200">

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-maritime-grid opacity-20 pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-[#0f172a]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Neeraksh Logo"
            className="h-8 w-8 rounded-full object-contain bg-slate-900 border border-slate-700/80"
          />
          <div className="flex items-center gap-1.5 font-sans font-semibold text-sm text-white">
            <span>NEERAKSH</span>
            <span className="text-slate-500">/</span>
            <span className="text-sky-400 font-normal">Tidemark</span>
          </div>
        </div>

        {/* Hackathon Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-600/30 text-amber-300">
          <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-medium text-xs">Smart India Hackathon 2026</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-slate-400 text-xs">
          <span className="flex items-center gap-1.5">
            <Satellite className="w-3.5 h-3.5 text-emerald-400" /> Sentinel-1 SAR: Online
          </span>
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-sky-400" /> AIS Feeds: Active
          </span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">

          {/* Clean Card */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative backdrop-blur-sm">

            {/* Header with Project Logo */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-1.5 rounded-2xl bg-slate-900 border border-slate-700/80 mb-3.5 shadow-sm">
                <img
                  src="/logo.png"
                  alt="Team Neeraksh Logo"
                  className="w-14 h-14 rounded-xl object-contain"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white">
                Maritime Operations Portal
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Oil Spill Detection & AIS Vessel Attribution Platform
              </p>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">

              {/* Callsign / User */}
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1.5 flex items-center justify-between">
                  <span>Operator Callsign or Name</span>
                  <span className="text-[11px] text-slate-400 font-normal">e.g. INCOIS / Coast Guard</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-sky-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    disabled={isAuthenticating}
                    placeholder="Enter callsign..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Clearance Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-sky-400" />
                    <span>Access Passcode</span>
                  </label>

                  {/* Quick autofill helper */}
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Autofill</span>
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Fingerprint className="w-4 h-4 text-sky-400" />
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
                    placeholder="Enter system passcode..."
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Hint Card */}
                <div className="mt-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Passcode:</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="font-medium text-amber-300 hover:text-amber-200 bg-amber-950/50 border border-amber-600/30 px-2 py-0.5 rounded-md hover:border-amber-400 transition-colors cursor-pointer font-mono text-xs"
                    title="Click to insert passcode"
                  >
                    SIH WINNER 2026
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember this session</span>
                </label>
                <span className="text-slate-400">Secure Node</span>
              </div>

              {/* Error Message Display */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs flex items-start gap-2.5 animate-bounce-short">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{errorMessage}</p>
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      className="mt-1 text-sky-300 underline hover:text-sky-200 font-medium block cursor-pointer"
                    >
                      Click here to load "SIH WINNER 2026"
                    </button>
                  </div>
                </div>
              )}

              {/* Loading State Animation */}
              {isAuthenticating && (
                <div className="p-3.5 rounded-xl bg-sky-950/50 border border-sky-600/40 text-sky-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-medium">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-sky-400 animate-spin" />
                      Connecting to Operations Center...
                    </span>
                    <span className="font-mono">{Math.min(100, Math.round(((authStep + 1) / authSteps.length) * 100))}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-sky-400 h-full transition-all duration-300 ease-out"
                      style={{ width: `${((authStep + 1) / authSteps.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-sky-300">
                    › {authSteps[authStep]}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-2.5 sm:py-3 px-4 rounded-xl font-medium text-sm text-white bg-sky-600 hover:bg-sky-500 shadow-sm hover:shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                <span>Sign In to Platform</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

            </form>

            {/* Quick Demo Access */}
            <div className="mt-5 pt-4 border-t border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 mb-2">
                Evaluator & Jury Quick Access
              </div>
              <button
                type="button"
                onClick={handleQuickDemoAccess}
                className="w-full py-2 px-3 rounded-xl bg-amber-950/30 hover:bg-amber-950/50 border border-amber-600/30 hover:border-amber-500/50 text-amber-300 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>One-Click Jury Evaluation Access (SIH 2026)</span>
              </button>
            </div>

          </div>

          <div className="mt-4 text-center text-slate-400 text-xs">
            Team Neeraksh · Smart India Hackathon 2026
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-[#090e1a] border-t border-slate-800/80 py-3 px-4 sm:px-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>NEERAKSH — Satellite Oil Spill Detection & Attribution</span>
        </div>
        <div className="text-slate-400">
          Demo Key: <span className="font-mono text-sky-400">SIH WINNER 2026</span>
        </div>
      </footer>

    </div>
  );
}
