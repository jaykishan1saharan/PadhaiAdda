import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  Sparkles,
  TrendingUp,
  Clock,
  ChevronRight,
  Lock,
  Eye,
  Download,
  Star,
  CheckCircle2,
  Bookmark,
  Share2,
  Lightbulb,
  Bell,
  GraduationCap,
  Layers,
  Filter,
} from 'lucide-react';
import { StudyResource, UserProfile, Announcement, DailyTip, ResourceType } from '../types';

interface HomeScreenProps {
  user: UserProfile;
  resources: StudyResource[];
  announcements: Announcement[];
  dailyTips: DailyTip[];
  selectedLevel: 'school' | 'college';
  onSelectLevel: (level: 'school' | 'college') => void;
  onOpenResource: (resource: StudyResource) => void;
  onOpenPremium: () => void;
  onOpenAiAssistant: () => void;
  onToggleFavorite: (resourceId: string) => void;
  darkTheme: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  resources,
  announcements,
  dailyTips,
  selectedLevel,
  onSelectLevel,
  onOpenResource,
  onOpenPremium,
  onOpenAiAssistant,
  onToggleFavorite,
  darkTheme,
}) => {
  // Filters for Class / Semester
  const [selectedClassNum, setSelectedClassNum] = useState<number>(user.classNum || 12);
  const [selectedSemester, setSelectedSemester] = useState<number>(user.semester || 5);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<ResourceType | 'all'>('all');

  // Filter resources based on selections
  const filteredResources = resources.filter(r => {
    if (r.educationLevel !== selectedLevel) return false;
    if (selectedLevel === 'school' && r.classNum && r.classNum !== selectedClassNum) return false;
    if (selectedLevel === 'college' && r.semester && r.semester !== selectedSemester) return false;
    if (selectedLevel === 'college' && selectedDepartment !== 'all' && r.department && r.department.toLowerCase() !== selectedDepartment.toLowerCase()) return false;
    if (selectedCategory !== 'all' && r.type !== selectedCategory) return false;
    return true;
  });

  // Recent history resource
  const continueResource = user.history.length > 0
    ? resources.find(r => r.id === user.history[0].resourceId)
    : null;

  const categoriesList: { type: ResourceType | 'all'; label: string; icon: any; bg: string }[] = [
    { type: 'all', label: 'All Materials', icon: Layers, bg: 'bg-indigo-500' },
    { type: 'notes', label: 'Notes', icon: BookOpen, bg: 'bg-blue-500' },
    { type: 'pyq', label: 'PYQs', icon: Clock, bg: 'bg-purple-500' },
    { type: 'assignment', label: 'Assignments', icon: FileText, bg: 'bg-emerald-500' },
    { type: 'lab_manual', label: 'Lab Manuals', icon: Award, bg: 'bg-amber-500' },
    { type: 'important_questions', label: 'Important Qs', icon: HelpCircle, bg: 'bg-rose-500' },
  ];

  const currentTip = dailyTips[0] || {
    title: 'Feynman Technique',
    content: 'Explain concepts in simple terms to spot gaps in your understanding.',
    subject: 'Study Tip',
    author: 'PadhaiAdda Coach',
  };

  return (
    <div className="pb-20 space-y-6 animate-fadeIn">
      {/* 1. Welcome Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white p-5 sm:p-6 shadow-xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white/30 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-indigo-700" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                  Welcome back, {user.name.split(' ')[0]}! 👋
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-indigo-100/90 font-medium mt-0.5">
                {selectedLevel === 'school'
                  ? `Class ${selectedClassNum} Student`
                  : `${user.college.split('(')[0]} • Sem ${selectedSemester} (${user.department})`}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-lg bg-white/20 backdrop-blur-md text-[10px] font-semibold text-white">
                  {selectedLevel === 'school' ? 'CBSE/State Board' : user.department}
                </span>
                {user.isPremium ? (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-400/30 text-amber-200 text-[10px] font-bold border border-amber-300/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-amber-300" />
                    Premium Member
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-900/40 text-indigo-200 text-[10px] font-medium border border-indigo-400/30">
                    Free Tier • Ad Unlocks
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* AI Tutor Assistant Quick Access CTA */}
          <button
            onClick={onOpenAiAssistant}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/30 text-white font-semibold text-xs flex items-center justify-center gap-2 backdrop-blur-md transition shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Ask AI Doubt Solver</span>
          </button>
        </div>
      </div>

      {/* 2. Continue Reading Card */}
      {continueResource && (
        <div
          className={`p-4 rounded-2xl border transition-all ${
            darkTheme
              ? 'bg-slate-900/80 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800'
          } shadow-sm hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Continue Reading
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Page {user.history[0]?.lastReadPage || 1} of {continueResource.pageCount}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold truncate">{continueResource.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {continueResource.subject} • {continueResource.author}
              </p>
            </div>

            <button
              onClick={() => onOpenResource(continueResource)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-500/20 transition active:scale-95"
            >
              <span>Resume</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reading progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  ((user.history[0]?.lastReadPage || 1) / continueResource.pageCount) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Class / Semester & Department Filter Selectors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm sm:text-base font-bold">
              {selectedLevel === 'school' ? 'Select School Class' : 'Select College Semester'}
            </h2>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
            {filteredResources.length} Materials
          </span>
        </div>

        {/* Level specific pills */}
        {selectedLevel === 'school' ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClassNum(cls)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedClassNum === cls
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : darkTheme
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Class {cls}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {Array.from({ length: 8 }, (_, i) => i + 1).map(sem => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedSemester === sem
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : darkTheme
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Semester {sem}
                </button>
              ))}
            </div>

            {/* Department selector for College */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
              {['all', 'Computer Science', 'Electrical', 'Mechanical', 'Civil', 'Commerce', 'Science'].map(
                dept => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      selectedDepartment === dept
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-semibold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {dept === 'all' ? 'All Depts' : dept}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Category Filter Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {categoriesList.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.type;
          return (
            <button
              key={cat.type}
              onClick={() => setSelectedCategory(cat.type)}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center transition transform active:scale-95 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : darkTheme
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl ${
                  isSelected ? 'bg-white/20' : cat.bg
                } text-white flex items-center justify-center`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold tracking-tight">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 5. Resources Feed Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Study Resources & Materials
          </h2>
        </div>

        {filteredResources.length === 0 ? (
          <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">
              No materials uploaded for this selection yet
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Use the Admin Panel to upload new notes, PYQs, and assignment solutions for{' '}
              {selectedLevel === 'school' ? `Class ${selectedClassNum}` : `Semester ${selectedSemester}`}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredResources.map(resource => {
              const isFav = user.favorites.includes(resource.id);
              return (
                <div
                  key={resource.id}
                  className={`group relative p-4 rounded-2xl border transition-all duration-200 ${
                    darkTheme
                      ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50'
                      : 'bg-white border-slate-200/80 hover:border-indigo-300'
                  } shadow-sm hover:shadow-md flex flex-col justify-between`}
                >
                  <div>
                    {/* Top row badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                          {resource.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {resource.fileSize} • {resource.pageCount} Pages
                        </span>
                      </div>

                      <button
                        onClick={() => onToggleFavorite(resource.id)}
                        className={`p-1.5 rounded-lg transition ${
                          isFav
                            ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                            : 'text-slate-400 hover:text-rose-500'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Title & Subject */}
                    <h3
                      onClick={() => onOpenResource(resource)}
                      className="text-sm font-bold leading-snug cursor-pointer group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2"
                    >
                      {resource.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {resource.description}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span>{resource.subject}</span>
                      <span>•</span>
                      <span>{resource.author}</span>
                    </div>
                  </div>

                  {/* Bottom Row Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {resource.viewsCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        {resource.downloadsCount}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {resource.rating}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenResource(resource)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm ${
                        resource.isLocked
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                      }`}
                    >
                      {resource.isLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlock via Ad</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>View PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Daily Study Tip Card */}
      <div
        className={`p-5 rounded-3xl border transition-all ${
          darkTheme
            ? 'bg-gradient-to-r from-slate-900 to-indigo-950/60 border-slate-800'
            : 'bg-gradient-to-r from-amber-50/80 to-indigo-50/80 border-amber-200/60'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-xl bg-amber-500 text-white shadow-sm">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Daily Study Hack
            </span>
            <h3 className="text-sm font-bold">{currentTip.title}</h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          "{currentTip.content}"
        </p>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Source: {currentTip.author}</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
            #{currentTip.subject}
          </span>
        </div>
      </div>

      {/* 7. Important Announcements */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-indigo-500" />
          Latest Exam & College Alerts
        </h2>

        <div className="space-y-2">
          {announcements.map(ann => (
            <div
              key={ann.id}
              className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                darkTheme
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div
                className={`p-2 rounded-xl text-white ${
                  ann.important ? 'bg-red-500' : 'bg-blue-500'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold truncate">{ann.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {ann.date}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {ann.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. StudyHub Premium Promo CTA */}
      {!user.isPremium && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-white/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 fill-white text-white" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-100">
                PadhaiAdda Premium
              </span>
            </div>

            <h3 className="text-lg font-extrabold leading-tight">
              Unlock 100% Ad-Free Reading & Offline Downloads
            </h3>

            <p className="text-xs text-amber-100/90 leading-relaxed">
              No rewarded ad delays. Instant access to all Class 1-12 & Semester 1-8 notes, PYQs,
              assignments and unlimited AI Doubt Solver queries.
            </p>

            <button
              onClick={onOpenPremium}
              className="px-5 py-2.5 rounded-2xl bg-white text-amber-700 hover:bg-amber-50 font-extrabold text-xs shadow-lg transition active:scale-95"
            >
              View Subscription Plans
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
