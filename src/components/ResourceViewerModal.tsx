import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Bookmark,
  Download,
  Share2,
  AlertTriangle,
  Sun,
  Moon,
  BookOpen,
  Check,
  Lock,
  Sparkles,
  FileText,
  List,
} from 'lucide-react';
import { StudyResource, UserProfile } from '../types';

interface ResourceViewerModalProps {
  resource: StudyResource | null;
  user: UserProfile;
  onClose: () => void;
  onUnlockResource: (resource: StudyResource) => void;
  onBookmarkPage: (resourceId: string, page: number) => void;
  onSaveOfflineDownload: (resourceId: string) => void;
  onRecordHistory: (resourceId: string, page: number) => void;
  darkTheme: boolean;
}

export const ResourceViewerModal: React.FC<ResourceViewerModalProps> = ({
  resource,
  user,
  onClose,
  onUnlockResource,
  onBookmarkPage,
  onSaveOfflineDownload,
  onRecordHistory,
  darkTheme,
}) => {
  if (!resource) return null;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [readingMode, setReadingMode] = useState<'light' | 'night' | 'sepia'>('night');
  const [showToc, setShowToc] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);
  const [reportText, setReportText] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const pages = resource.samplePagesText && resource.samplePagesText.length > 0
    ? resource.samplePagesText
    : [
        `PAGE 1: ${resource.title}\nSubject: ${resource.subject}\nAuthor: ${resource.author}\n\nKey Concepts & Lecture Summary:\nThis document contains comprehensive notes, solved sample questions, key formulas, and step-by-step solutions designed for ${resource.subject}.`,
        `PAGE 2: Detailed Proofs & Worked Examples\n1. State and prove the fundamental theorems.\n2. Key exam problems with verified step-by-step solutions.\n\nSummary & Formulas:\n- Essential Formula 1: E = mc²\n- Essential Formula 2: F = ma`,
      ];

  const totalPages = Math.max(resource.pageCount, pages.length);
  const currentPageText = pages[(currentPage - 1) % pages.length] || pages[0];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      onRecordHistory(resource.id, nextPage);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      onRecordHistory(resource.id, prevPage);
    }
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
      setReportText('');
    }, 1500);
  };

  // If resource is locked and user is not premium, present Locked Overlay
  if (resource.isLocked && !user.isPremium) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl relative space-y-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center space-y-1">
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
              Locked Study Material
            </span>
            <h2 className="text-lg font-extrabold">{resource.title}</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Watch a quick rewarded ad to unlock 24-hour full access to this resource, or upgrade to PadhaiAdda Premium for ad-free instant downloads.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => onUnlockResource(resource)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              <span>Watch Rewarded Ad to Unlock (Free)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Reading mode canvas styles
  const readingStyles = {
    light: 'bg-white text-slate-900',
    night: 'bg-slate-950 text-slate-100',
    sepia: 'bg-[#f8f1e3] text-[#433422]',
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 animate-fadeIn overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="h-14 sm:h-16 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h2 className="text-sm font-bold truncate leading-tight">{resource.title}</h2>
            <p className="text-[11px] text-slate-400 truncate">
              {resource.subject} • Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        {/* Viewer Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Table of Contents Drawer Toggle */}
          <button
            onClick={() => setShowToc(!showToc)}
            title="Table of Contents"
            className={`p-2 rounded-xl transition ${
              showToc ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <List className="w-4 h-4" />
          </button>

          {/* Theme Mode Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setReadingMode('light')}
              title="Light Mode"
              className={`p-1 rounded-lg transition ${
                readingMode === 'light' ? 'bg-white text-slate-900' : 'text-slate-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setReadingMode('night')}
              title="Night Mode"
              className={`p-1 rounded-lg transition ${
                readingMode === 'night' ? 'bg-slate-950 text-white' : 'text-slate-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setReadingMode('sepia')}
              title="Sepia Mode"
              className={`px-1.5 text-[10px] font-bold rounded-lg transition ${
                readingMode === 'sepia' ? 'bg-[#f8f1e3] text-[#433422]' : 'text-slate-400'
              }`}
            >
              SEP
            </button>
          </div>

          {/* Save Offline Download */}
          {user.isPremium || resource.downloadAllowed ? (
            <button
              onClick={() => onSaveOfflineDownload(resource.id)}
              title="Download Offline PDF"
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition active:scale-95"
            >
              <Download className="w-4 h-4" />
            </button>
          ) : null}

          {/* Bookmark Current Page */}
          <button
            onClick={() => onBookmarkPage(resource.id, currentPage)}
            title="Bookmark Page"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            title="Share Link"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition relative"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Report File */}
          <button
            onClick={() => setShowReportModal(true)}
            title="Report Broken File"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 transition"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Table of Contents Side Drawer */}
        {showToc && (
          <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-3 z-20 overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Table of Contents
            </h3>
            <div className="space-y-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    setShowToc(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Page {pageNum}: Chapter {pageNum} Overview
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Document Page Screen */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start bg-slate-900/50">
          <div
            className={`w-full max-w-3xl min-h-[600px] p-6 sm:p-10 rounded-2xl shadow-2xl transition-all duration-200 border ${
              readingStyles[readingMode]
            } border-slate-700/50`}
            style={{ zoom: `${zoomLevel}%` }}
          >
            {/* Document Header Metadata */}
            <div className="border-b pb-4 mb-6 flex items-center justify-between opacity-80 text-xs font-medium">
              <span>{resource.collegeName || 'PadhaiAdda Educational Resource'}</span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>

            {/* Document Page Content */}
            <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
              {currentPageText}
            </div>

            {/* Footer Watermark */}
            <div className="mt-12 pt-4 border-t opacity-60 text-[10px] flex items-center justify-between">
              <span>PadhaiAdda Verified Notes • Author: {resource.author}</span>
              <span>Licensed for Free Student Revision</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Page Navigation Controls */}
      <div className="h-16 px-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-400 min-w-[45px] text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Page Slider / Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Report Broken File Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              Report Issue with File
            </h3>

            {reportSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-center text-xs font-bold">
                Thank you! Issue report submitted to moderators.
              </div>
            ) : (
              <form onSubmit={handleReport} className="space-y-3">
                <p className="text-xs text-slate-400">
                  Please specify if pages are missing, corrupt, or incorrect:
                </p>
                <textarea
                  value={reportText}
                  onChange={e => setReportText(e.target.value)}
                  placeholder="Describe the issue (e.g. Page 3 text is cut off)..."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-rose-500"
                  rows={3}
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
