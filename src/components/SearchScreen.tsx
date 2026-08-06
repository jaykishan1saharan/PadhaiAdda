import React, { useState } from 'react';
import {
  Search,
  Mic,
  X,
  Filter,
  BookOpen,
  Lock,
  Eye,
  Download,
  Star,
  Clock,
  Sparkles,
} from 'lucide-react';
import { StudyResource, ResourceType } from '../types';

interface SearchScreenProps {
  resources: StudyResource[];
  onOpenResource: (resource: StudyResource) => void;
  onOpenVoiceSearch: () => void;
  darkTheme: boolean;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  resources,
  onOpenResource,
  onOpenVoiceSearch,
  darkTheme,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'school' | 'college'>('all');
  const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');

  const recentSearches = [
    'Software Engineering',
    'Class 12 Physics Derivations',
    'DBMS PYQ 2024',
    'Computer Networks Lab',
    'Operating Systems Assignment',
  ];

  const filtered = resources.filter(resource => {
    if (selectedType !== 'all' && resource.type !== selectedType) return false;
    if (selectedLevel !== 'all' && resource.educationLevel !== selectedLevel) return false;
    if (selectedClass !== 'all' && resource.classNum !== selectedClass) return false;
    if (selectedSemester !== 'all' && resource.semester !== selectedSemester) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      return (
        resource.title.toLowerCase().includes(q) ||
        resource.description.toLowerCase().includes(q) ||
        resource.subject.toLowerCase().includes(q) ||
        resource.author.toLowerCase().includes(q) ||
        resource.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <div className="pb-20 space-y-5 animate-fadeIn">
      {/* Top Search Header */}
      <div className="space-y-3">
        <h1 className="text-lg font-extrabold tracking-tight">Search Resources</h1>

        <div className="relative flex items-center gap-2">
          <div
            className={`flex-1 flex items-center px-3.5 py-2.5 rounded-2xl border transition-all ${
              darkTheme
                ? 'bg-slate-900 border-slate-800 focus-within:border-indigo-500'
                : 'bg-white border-slate-200 focus-within:border-indigo-500'
            } shadow-sm`}
          >
            <Search className="w-5 h-5 text-slate-400 mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search notes, PYQs, subjects, teachers..."
              className="w-full bg-transparent text-sm focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onOpenVoiceSearch}
            title="Voice Search"
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 active:scale-95 transition"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {/* Recent Search Pills */}
        {!searchTerm && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" /> Recent Searches
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {recentSearches.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchTerm(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                    darkTheme
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Row Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            Quick Filters
          </span>
          {searchTerm || selectedType !== 'all' || selectedLevel !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedLevel('all');
                setSelectedClass('all');
                setSelectedSemester('all');
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset Filters
            </button>
          ) : null}
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          {[
            { id: 'all', label: 'All Levels' },
            { id: 'school', label: 'School' },
            { id: 'college', label: 'College' },
          ].map(lvl => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                selectedLevel === lvl.id
                  ? 'bg-indigo-600 text-white'
                  : darkTheme
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Resource Type Selector */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'notes', label: 'Notes' },
            { id: 'pyq', label: 'PYQs' },
            { id: 'assignment', label: 'Assignments' },
            { id: 'lab_manual', label: 'Lab Manuals' },
            { id: 'important_questions', label: 'Important Qs' },
            { id: 'sample_paper', label: 'Sample Papers' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                selectedType === t.id
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-500">
          Found {filtered.length} matching resources
        </span>
      </div>

      {/* Results Grid */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
          <Search className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold">No matching resources found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Try searching for a different keyword or reset your filter selections.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(resource => (
            <div
              key={resource.id}
              onClick={() => onOpenResource(resource)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                darkTheme
                  ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              } shadow-sm hover:shadow-md flex items-center justify-between gap-3`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold uppercase">
                    {resource.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {resource.educationLevel === 'school'
                      ? `Class ${resource.classNum}`
                      : `Sem ${resource.semester}`}
                  </span>
                </div>

                <h3 className="text-sm font-bold truncate">{resource.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {resource.subject} • {resource.author}
                </p>

                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-0.5">
                    <Eye className="w-3 h-3" /> {resource.viewsCount}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Download className="w-3 h-3" /> {resource.downloadsCount}
                  </span>
                  <span className="text-amber-500 font-bold flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-500" /> {resource.rating}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {resource.isLocked ? (
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
                    <Lock className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/30">
                    <BookOpen className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
