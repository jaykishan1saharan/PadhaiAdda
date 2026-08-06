import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface BannerAdBarProps {
  isPremium: boolean;
  onOpenPremium: () => void;
  darkTheme: boolean;
}

export const BannerAdBar: React.FC<BannerAdBarProps> = ({
  isPremium,
  onOpenPremium,
  darkTheme,
}) => {
  if (isPremium) return null;

  return (
    <div className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 py-2 px-3 flex items-center justify-between gap-2 text-[11px] select-none">
      <div className="flex items-center gap-2 truncate min-w-0">
        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-black text-[9px] uppercase border border-amber-500/30">
          AD
        </span>
        <span className="truncate">
          PadhaiAdda Premium • 100% Ad-Free Reading & Offline Downloads
        </span>
      </div>

      <button
        onClick={onOpenPremium}
        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold whitespace-nowrap text-[10px] shrink-0"
      >
        Go Ad-Free
      </button>
    </div>
  );
};
