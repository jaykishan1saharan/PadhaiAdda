import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Play, Volume2, ShieldCheck, Lock } from 'lucide-react';
import { StudyResource } from '../types';

interface RewardedAdModalProps {
  resource: StudyResource | null;
  onClose: () => void;
  onAdCompleted: (resourceId: string) => void;
  onOpenPremium: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  resource,
  onClose,
  onAdCompleted,
  onOpenPremium,
}) => {
  if (!resource) return null;

  const [countdown, setCountdown] = useState<number>(5);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsFinished(true);
    }
  }, [countdown]);

  const handleClaimUnlock = () => {
    onAdCompleted(resource.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden relative space-y-4 p-5">
        {/* Top Header */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Sparkles className="w-4 h-4 fill-amber-400" />
            <span>AdMob Rewarded Sponsor</span>
          </div>

          {isFinished ? (
            <button
              onClick={handleClaimUnlock}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
              Ad in {countdown}s
            </span>
          )}
        </div>

        {/* Video / Banner Ad Box Simulation */}
        <div className="relative w-full h-48 rounded-2xl bg-gradient-to-tr from-indigo-950 via-slate-900 to-blue-950 border border-slate-700/60 overflow-hidden flex flex-col items-center justify-center p-4 text-center space-y-2">
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse pointer-events-none" />

          <div className="w-12 h-12 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/40 animate-bounce">
            <Play className="w-6 h-6 fill-indigo-400" />
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
              Sponsored Education Partner
            </span>
            <h3 className="text-sm font-extrabold text-white">
              Learn Coding & AI with Interactive Courses
            </h3>
            <p className="text-[11px] text-slate-400">
              Unlock millions of practice problems & study guides.
            </p>
          </div>

          <div className="absolute bottom-2 right-2 p-1 rounded-md bg-slate-950/80 text-slate-400">
            <Volume2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Status / Claim CTA */}
        <div className="space-y-2 text-center">
          {isFinished ? (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ad Completed! Resource Unlocked for 24 Hours</span>
              </div>

              <button
                onClick={handleClaimUnlock}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Open Unlocked Resource Now</span>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300">
              Please wait {countdown} seconds for the ad to finish playing...
            </div>
          )}

          {/* Upgrade to Premium Link */}
          <button
            onClick={() => {
              onClose();
              onOpenPremium();
            }}
            className="text-xs text-amber-400 hover:underline font-bold pt-1 block mx-auto"
          >
            Tired of ads? Upgrade to PadhaiAdda Premium →
          </button>
        </div>
      </div>
    </div>
  );
};
