import React from 'react';
import { PadhaiAddaLogo } from './PadhaiAddaLogo';
import {
  Bell,
  Moon,
  Sun,
  Shield,
  Sparkles,
  BookOpen,
  LogOut,
  LogIn,
} from 'lucide-react';
import { UserProfile, Announcement } from '../types';

interface NavbarProps {
  user: UserProfile;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  darkTheme: boolean;
  onToggleTheme: () => void;
  onOpenAdmin: () => void;
  onOpenNotifications: () => void;
  onOpenPremium: () => void;
  onOpenProfile?: () => void;
  announcements: Announcement[];
  selectedLevel: 'school' | 'college';
  onSelectLevel: (level: 'school' | 'college') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isLoggedIn,
  onOpenLogin,
  onLogout,
  darkTheme,
  onToggleTheme,
  onOpenAdmin,
  onOpenNotifications,
  onOpenPremium,
  onOpenProfile,
  announcements,
  selectedLevel,
  onSelectLevel,
}) => {
  const unreadCount = announcements.filter(a => a.important).length;

  return (
    <header
      className={`sticky top-0 z-30 w-full max-w-full overflow-hidden backdrop-blur-md transition-colors border-b ${darkTheme
        ? 'bg-slate-900/95 border-slate-800 text-slate-100'
        : 'bg-white/95 border-slate-200 text-slate-900'
        }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Main Row */}
        <div className="h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => onOpenProfile?.()}>
            <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
              <PadhaiAddaLogo className="w-full h-full drop-shadow-md" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-blue-600">
                  PadhaiAdda
                </span>
                {user.isPremium ? (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-md flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5 fill-amber-500" />
                    PRO
                  </span>
                ) : null}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                Free Learning & Exam Portal
              </p>
            </div>
          </div>

          {/* Desktop Middle Switcher (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onSelectLevel('school')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${selectedLevel === 'school'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              School (1-12)
            </button>
            <button
              onClick={() => onSelectLevel('college')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${selectedLevel === 'college'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
              College
            </button>
            <button
              onClick={onOpenAdmin}
              title="Admin Portal - PDF Uploads & Notice Alerts"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-500/15 dark:hover:bg-emerald-500/25 border border-emerald-500/30 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="whitespace-nowrap">Admin Portal</span>
            </button>
          </div>

          {/* Right Actions & Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              title="Toggle Light/Dark Theme"
              className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {darkTheme ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              title="Notifications & Announcements"
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              )}
            </button>

            {/* Upgrade to Premium Button */}
            {!user.isPremium && (
              <button
                onClick={onOpenPremium}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition transform active:scale-95 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                <span>Get Premium</span>
              </button>
            )}

            {/* User Avatar & Login/Logout Action */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={onOpenProfile}
                  title={`View Profile (${user.name})`}
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl overflow-hidden border-2 border-indigo-500/40 hover:border-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 shrink-0"
                >
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </button>
                <button
                  onClick={onLogout}
                  title="Log Out of Account"
                  className="p-1 sm:p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition active:scale-95 shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Level Switcher Bar (Horizontally scrollable inside navbar) */}
        <div className="md:hidden pb-2 pt-0.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={() => onSelectLevel('school')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${selectedLevel === 'school'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
                }`}
            >
              School (1-12)
            </button>
            <button
              onClick={() => onSelectLevel('college')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${selectedLevel === 'college'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
                }`}
            >
              College
            </button>
          </div>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 whitespace-nowrap shrink-0"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Admin Portal</span>
          </button>

          {!user.isPremium && (
            <button
              onClick={onOpenPremium}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3 h-3 fill-white" />
              <span>Get Premium</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
