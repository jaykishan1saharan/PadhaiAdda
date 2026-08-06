import React, { useState } from 'react';
import { Bookmark, Heart, Download, BookOpen, Trash2, HardDrive, Lock } from 'lucide-react';
import { StudyResource, UserProfile } from '../types';

interface BookmarksScreenProps {
  user: UserProfile;
  resources: StudyResource[];
  onOpenResource: (resource: StudyResource) => void;
  onToggleFavorite: (resourceId: string) => void;
  onToggleBookmark: (resourceId: string) => void;
  darkTheme: boolean;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({
  user,
  resources,
  onOpenResource,
  onToggleFavorite,
  onToggleBookmark,
  darkTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'favorites' | 'downloads'>('bookmarks');

  const bookmarkedResources = resources.filter(r => user.bookmarks.includes(r.id));
  const favoriteResources = resources.filter(r => user.favorites.includes(r.id));
  const downloadedResources = resources.filter(r => user.downloads.includes(r.id));

  const currentList =
    activeTab === 'bookmarks'
      ? bookmarkedResources
      : activeTab === 'favorites'
      ? favoriteResources
      : downloadedResources;

  return (
    <div className="pb-20 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">Saved Study Library</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your bookmarked pages, offline PDFs, and favorited materials.
          </p>
        </div>
      </div>

      {/* Tab Switchers */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
        {[
          { id: 'bookmarks', label: `Bookmarks (${bookmarkedResources.length})`, icon: Bookmark },
          { id: 'favorites', label: `Favorites (${favoriteResources.length})`, icon: Heart },
          { id: 'downloads', label: `Offline (${downloadedResources.length})`, icon: Download },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Downloaded Storage Meter */}
      {activeTab === 'downloads' && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            darkTheme ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold">Offline Storage Used</h4>
              <p className="text-[11px] text-slate-400">
                {downloadedResources.length * 3.5} MB / 500 MB Encrypted Cache
              </p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-indigo-500">
            {downloadedResources.length} Files
          </span>
        </div>
      )}

      {/* Resource List Grid */}
      {currentList.length === 0 ? (
        <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
          <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold">No saved items in this collection</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Tap the bookmark or favorite icon on any resource card to add it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map(resource => (
            <div
              key={resource.id}
              className={`p-4 rounded-2xl border transition-all ${
                darkTheme
                  ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50'
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              } shadow-sm hover:shadow-md flex items-center justify-between gap-3`}
            >
              <div
                onClick={() => onOpenResource(resource)}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <span className="px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold uppercase">
                  {resource.type.replace('_', ' ')}
                </span>
                <h3 className="text-sm font-bold truncate mt-1">{resource.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {resource.subject} • {resource.fileSize}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenResource(resource)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open</span>
                </button>

                <button
                  onClick={() => {
                    if (activeTab === 'bookmarks') onToggleBookmark(resource.id);
                    else if (activeTab === 'favorites') onToggleFavorite(resource.id);
                  }}
                  className="p-1.5 rounded-xl bg-slate-800/20 text-rose-500 hover:bg-rose-500/20"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
