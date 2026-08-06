import React from 'react';
import { Home, Search, Bot, Bookmark, User } from 'lucide-react';

export type TabType = 'home' | 'search' | 'ai' | 'bookmarks' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  bookmarksCount: number;
  darkTheme: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  bookmarksCount,
  darkTheme,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'search' as TabType, label: 'Search', icon: Search },
    { id: 'ai' as TabType, label: 'AI Doubt Solver', icon: Bot, isSpecial: true },
    { id: 'bookmarks' as TabType, label: 'Saved', icon: Bookmark, badge: bookmarksCount },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-30 border-t transition-colors ${
        darkTheme
          ? 'bg-slate-900/95 border-slate-800 text-slate-300'
          : 'bg-white/95 border-slate-200 text-slate-600'
      } backdrop-blur-md pb-safe`}
    >
      <div className="max-w-md mx-auto px-4 h-14 sm:h-16 flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform active:scale-90 ${
                    isActive
                      ? 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 shadow-indigo-500/40 ring-4 ring-indigo-500/20'
                      : 'bg-gradient-to-tr from-indigo-500 to-blue-500 shadow-indigo-500/30'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 ${
                    isActive ? 'text-indigo-500' : 'text-slate-400'
                  }`}
                >
                  AI Study
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center w-14 h-full transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-indigo-50 dark:bg-indigo-950/60' : 'bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>

              {tab.badge && tab.badge > 0 ? (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-extrabold flex items-center justify-center border border-white dark:border-slate-900">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
