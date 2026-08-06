import React, { useState } from 'react';
import { Shield, Lock, KeyRound, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  darkTheme: boolean;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  onClose,
  onSuccess,
  darkTheme,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Default admin passcode
  const DEFAULT_PIN = 'admin123';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (passcode.trim() === DEFAULT_PIN || passcode.trim() === '1234' || passcode.trim() === 'admin') {
        onSuccess();
      } else {
        setErrorMsg('Invalid admin credentials. Please enter the correct Security PIN.');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-sm p-6 rounded-3xl border shadow-2xl relative space-y-5 ${
          darkTheme ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Shield Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-extrabold tracking-tight">Admin Authentication</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Authorized Faculty & Admin Access Only. Please enter your security passcode.
          </p>
        </div>

        {/* Demo PIN Banner */}
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center justify-between">
          <span>Demo Admin Passcode:</span>
          <code className="px-2 py-0.5 rounded bg-indigo-500/20 font-bold font-mono text-indigo-700 dark:text-indigo-300">
            admin123
          </code>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              Security PIN / Passcode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={e => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter passcode (e.g. admin123)"
                className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-xs border font-medium focus:outline-none ${
                  darkTheme
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'
                }`}
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !passcode}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Verify & Enter Admin Portal</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
