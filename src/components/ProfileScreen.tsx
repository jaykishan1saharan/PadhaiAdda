import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Edit2,
  Mail,
  Phone,
  BookOpen,
  Eye,
  Award,
  Moon,
  Sun,
  Shield,
  Bell,
  Trash2,
  HelpCircle,
  X,
  Check,
  LogOut,
  LogIn,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenPremium: () => void;
  onOpenAdmin: () => void;
  darkTheme: boolean;
  onToggleTheme: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  isLoggedIn,
  onOpenLogin,
  onLogout,
  onUpdateUser,
  onOpenPremium,
  onOpenAdmin,
  darkTheme,
  onToggleTheme,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [collegeInput, setCollegeInput] = useState(user.college);
  const [classInput, setClassInput] = useState(user.classNum);
  const [semesterInput, setSemesterInput] = useState(user.semester);
  const [departmentInput, setDepartmentInput] = useState(user.department);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: nameInput,
      college: collegeInput,
      classNum: Number(classInput),
      semester: Number(semesterInput),
      department: departmentInput,
    });
    setShowEditModal(false);
  };

  return (
    <div className="pb-20 space-y-5 animate-fadeIn">
      {/* Profile Card */}
      <div
        className={`p-6 rounded-3xl border ${
          darkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-4`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40"
              />
              {user.isPremium && (
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950">
                  <Sparkles className="w-3 h-3 fill-slate-950" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold">{user.name}</h2>
                {user.isPremium && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-500 text-[10px] font-bold">
                    PREMIUM
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {user.educationLevel === 'school'
                  ? `Class ${user.classNum} Student`
                  : `${user.college} • Sem ${user.semester}`}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500"
            title="Edit Profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-sm font-extrabold text-indigo-500">{user.history.length}</span>
            <p className="text-[10px] text-slate-400 font-medium">Resources Read</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-sm font-extrabold text-emerald-500">
              {user.downloads.length}
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Offline PDFs</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-sm font-extrabold text-amber-500">7 Days</span>
            <p className="text-[10px] text-slate-400 font-medium">Study Streak</p>
          </div>
        </div>
      </div>

      {/* Premium Upgrade Banner */}
      {!user.isPremium ? (
        <div
          onClick={onOpenPremium}
          className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 cursor-pointer hover:opacity-95 transition flex items-center justify-between gap-3"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-black text-amber-100 text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-white" />
              <span>PadhaiAdda Premium</span>
            </div>
            <h3 className="text-sm font-extrabold">Remove All Ads & Unlock Downloads</h3>
            <p className="text-xs text-amber-100/90">Plans starting at just ₹99/month</p>
          </div>
          <button className="px-3.5 py-2 rounded-xl bg-white text-amber-700 font-extrabold text-xs shrink-0">
            Upgrade
          </button>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-between">
          <span>Active Plan: PadhaiAdda {user.premiumPlan.toUpperCase()} Pass</span>
          <span className="text-[10px] text-slate-400">Renews Aug 2027</span>
        </div>
      )}

      {/* App Settings List */}
      <div
        className={`rounded-3xl border overflow-hidden ${
          darkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-400">
          Account & App Settings
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-medium">
          <button
            onClick={onToggleTheme}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
          >
            <span className="flex items-center gap-3">
              {darkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              <span>Dark Theme Preference</span>
            </span>
            <span className="text-slate-400">{darkTheme ? 'Enabled' : 'Disabled'}</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-emerald-500"
          >
            <span className="flex items-center gap-3 font-bold">
              <Shield className="w-4 h-4" />
              <span>Admin & Faculty Portal</span>
            </span>
            <span>→</span>
          </button>

          <div className="p-4 flex items-center justify-between">
            <span className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span>Exam Notifications & Alerts</span>
            </span>
            <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
          </div>

          <div className="p-4 flex items-center justify-between text-slate-400">
            <span>App Version</span>
            <span>v1.0.0 (Production Build)</span>
          </div>

          {/* Account Logout / Login Row */}
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="w-full p-4 flex items-center justify-between bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold transition"
            >
              <span className="flex items-center gap-3">
                <LogOut className="w-4 h-4" />
                <span>Log Out of Account</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/20">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="w-full p-4 flex items-center justify-between bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold transition"
            >
              <span className="flex items-center gap-3">
                <LogIn className="w-4 h-4" />
                <span>Sign In to Your Account</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20">Log In</span>
            </button>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Edit Student Profile</h3>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Student Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">College / School Name</label>
                <input
                  type="text"
                  value={collegeInput}
                  onChange={e => setCollegeInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Class (1-12)</label>
                  <input
                    type="number"
                    value={classInput}
                    onChange={e => setClassInput(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Semester (1-8)</label>
                  <input
                    type="number"
                    value={semesterInput}
                    onChange={e => setSemesterInput(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Department</label>
                <input
                  type="text"
                  value={departmentInput}
                  onChange={e => setDepartmentInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
