import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  X,
  LogIn,
  UserPlus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile } from '../types';

interface UserAuthModalProps {
  onClose: () => void;
  onSuccess: (userProfile?: Partial<UserProfile>) => void;
  darkTheme: boolean;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  onClose,
  onSuccess,
  darkTheme,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [collegeOrSchool, setCollegeOrSchool] = useState('');
  const [educationLevel, setEducationLevel] = useState<'school' | 'college'>('college');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'signin') {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter both email and password.');
          return;
        }
        // Success sign in
        onSuccess({
          email: email.trim(),
          name: email.split('@')[0].replace('.', ' ').toUpperCase() || 'Student User',
        });
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setErrorMsg('Please fill in all required fields.');
          return;
        }
        // Success sign up
        onSuccess({
          name: name.trim(),
          email: email.trim(),
          college: educationLevel === 'college' ? collegeOrSchool || 'IIT Delhi' : 'DPS New Delhi',
          educationLevel,
        });
      }
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: 'Alex Kumar',
        email: 'alex.kumar@studyhub.edu',
        college: 'IIT Delhi',
        educationLevel: 'college',
      });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl relative space-y-5 ${
          darkTheme ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {mode === 'signin' ? 'Welcome Back to PadhaiAdda' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'signin'
              ? 'Sign in to access your saved notes, assignments & PYQs'
              : 'Join thousands of students accessing free study materials'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 font-semibold text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signin'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-extrabold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border font-medium focus:outline-none ${
                      darkTheme
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Education Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEducationLevel('school')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition ${
                      educationLevel === 'school'
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500'
                        : darkTheme
                        ? 'bg-slate-800 border-slate-700 text-slate-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    School (Class 1-12)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEducationLevel('college')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition ${
                      educationLevel === 'college'
                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500'
                        : darkTheme
                        ? 'bg-slate-800 border-slate-700 text-slate-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    College / University
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  {educationLevel === 'college' ? 'College Name' : 'School Name'}
                </label>
                <input
                  type="text"
                  value={collegeOrSchool}
                  onChange={e => setCollegeOrSchool(e.target.value)}
                  placeholder={educationLevel === 'college' ? 'e.g. IIT Delhi' : 'e.g. DPS R.K. Puram'}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs border font-medium focus:outline-none ${
                    darkTheme
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                  }`}
                />
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@studyhub.edu"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border font-medium focus:outline-none ${
                  darkTheme
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border font-medium focus:outline-none ${
                  darkTheme
                    ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'
                }`}
                required
              />
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
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Login Divider */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[11px] text-center text-slate-400 font-medium">Or test instantly with 1-Click Demo Account:</p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-3.5 h-3.5 fill-indigo-500" />
            <span>Quick Demo Student Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};
