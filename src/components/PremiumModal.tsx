import React, { useState } from 'react';
import { X, Sparkles, Check, Zap, ShieldCheck, Star } from 'lucide-react';
import { PREMIUM_PLANS } from '../data/initialData';
import { UserProfile } from '../types';

interface PremiumModalProps {
  user: UserProfile;
  onClose: () => void;
  onActivatePremium: (planId: 'monthly' | 'yearly' | 'lifetime') => void;
  darkTheme: boolean;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  user,
  onClose,
  onActivatePremium,
  darkTheme,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMessage(true);
      onActivatePremium(selectedPlan);
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fadeIn p-4 sm:p-6">
      <div className="min-h-full flex items-center justify-center">
        <div className="w-full max-w-lg my-8 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl relative space-y-5">
          {/* Top Header with Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="text-xs font-extrabold tracking-wide uppercase text-amber-400">
                PadhaiAdda Premium
              </span>
            </div>
            <button
              onClick={onClose}
              title="Close Modal"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <X className="w-4 h-4 text-slate-300" />
              <span>Close</span>
            </button>
          </div>

          {/* Hero Banner Header */}
          <div className="text-center space-y-2 pt-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
              <Sparkles className="w-7 h-7 fill-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Upgrade to PadhaiAdda Premium</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Supercharge your exam preparation with zero ad delays, unlimited offline downloads & instant AI Doubt Solving.
            </p>
          </div>

        {/* Success Confirmation */}
        {successMessage ? (
          <div className="p-6 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-center space-y-2">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-base font-extrabold">Welcome to PadhaiAdda Premium! 🎉</h3>
            <p className="text-xs text-emerald-200">
              Your subscription is now active. Enjoy ad-free offline access across all resources!
            </p>
          </div>
        ) : (
          <>
            {/* Plan Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PREMIUM_PLANS.map(plan => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/10 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                        Best Value
                      </span>
                    )}

                    <div>
                      <h4 className="text-xs font-bold text-slate-300">{plan.name}</h4>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-lg font-extrabold text-white">{plan.price}</span>
                        {plan.originalPrice && (
                          <span className="text-[10px] text-slate-500 line-through">
                            {plan.originalPrice}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{plan.billingPeriod}</p>
                    </div>

                    <div className="mt-3 flex items-center justify-center">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500 text-slate-950'
                            : 'border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Included Benefits List */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Included in Your Subscription
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>100% Ad-Free Reading Experience across School & College</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Unlimited Offline PDF Downloads for revision anywhere</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant AI Doubt Solver, Summaries & Flashcards</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Dark Mode & Custom Reader Accent Preferences</span>
                </li>
              </ul>
            </div>

            {/* Subscribe Action Button */}
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isProcessing ? (
                <span>Activating Subscription...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>
                    Activate {PREMIUM_PLANS.find(p => p.id === selectedPlan)?.name} (
                    {PREMIUM_PLANS.find(p => p.id === selectedPlan)?.price})
                  </span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);
};
