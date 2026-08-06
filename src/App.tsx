import React, { useState, useEffect } from 'react';
import { AndroidDeviceFrame } from './components/AndroidDeviceFrame';
import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { AiAssistantScreen } from './components/AiAssistantScreen';
import { BookmarksScreen } from './components/BookmarksScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ResourceViewerModal } from './components/ResourceViewerModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { PremiumModal } from './components/PremiumModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { UserAuthModal } from './components/UserAuthModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { BannerAdBar } from './components/BannerAdBar';
import { INITIAL_USER, INITIAL_RESOURCES, INITIAL_ANNOUNCEMENTS, DAILY_TIPS } from './data/initialData';
import { StudyResource, UserProfile, Announcement } from './types';

export default function App() {
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedLevel, setSelectedLevel] = useState<'school' | 'college'>('college');

  // Application Stores
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [resources, setResources] = useState<StudyResource[]>(INITIAL_RESOURCES);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);

  // Student Auth State
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(true);
  const [showUserAuthModal, setShowUserAuthModal] = useState<boolean>(false);

  // Modals & Overlays State
  const [viewerResource, setViewerResource] = useState<StudyResource | null>(null);
  const [adUnlockResource, setAdUnlockResource] = useState<StudyResource | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);

  // Student Logout / Login Handlers
  const handleLogout = () => {
    setIsUserLoggedIn(false);
  };

  const handleLoginSuccess = (updatedFields?: Partial<UserProfile>) => {
    if (updatedFields) {
      setUser(prev => ({ ...prev, ...updatedFields }));
    }
    setIsUserLoggedIn(true);
    setShowUserAuthModal(false);
  };

  // Trigger Admin Portal with verification check
  const handleOpenAdminPortal = () => {
    if (isAdminAuthenticated) {
      setShowAdminModal(true);
    } else {
      setShowAdminAuthModal(true);
    }
  };

  // Fetch API data on mount
  useEffect(() => {
    fetch('/api/resources')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setResources(data);
      })
      .catch(err => console.log('Using initial mock resources', err));

    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data && data.id) setUser(data);
      })
      .catch(err => console.log('Using initial user profile', err));

    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setAnnouncements(data);
      })
      .catch(err => console.log('Using initial announcements', err));
  }, []);

  // Open resource viewer handler
  const handleOpenResource = (resource: StudyResource) => {
    setViewerResource(resource);
  };

  // Open ad unlock handler
  const handleOpenAdUnlock = (resource: StudyResource) => {
    setAdUnlockResource(resource);
  };

  // Handle Rewarded Ad Completed
  const handleAdCompleted = async (resourceId: string) => {
    try {
      const res = await fetch(`/api/resources/${resourceId}/unlock`, { method: 'POST' });
      const data = await res.json();

      setResources(prev =>
        prev.map(r => (r.id === resourceId ? { ...r, isLocked: false } : r))
      );

      const updated = resources.find(r => r.id === resourceId);
      if (updated) {
        setViewerResource({ ...updated, isLocked: false });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdUnlockResource(null);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (resourceId: string) => {
    const isFav = user.favorites.includes(resourceId);
    const newFavs = isFav
      ? user.favorites.filter(id => id !== resourceId)
      : [...user.favorites, resourceId];

    setUser(prev => ({ ...prev, favorites: newFavs }));

    fetch('/api/user/favorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId }),
    }).catch(err => console.error(err));
  };

  // Toggle Bookmark
  const handleToggleBookmark = async (resourceId: string) => {
    const isBookmarked = user.bookmarks.includes(resourceId);
    const newBookmarks = isBookmarked
      ? user.bookmarks.filter(id => id !== resourceId)
      : [...user.bookmarks, resourceId];

    setUser(prev => ({ ...prev, bookmarks: newBookmarks }));

    fetch('/api/user/bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId }),
    }).catch(err => console.error(err));
  };

  // Save Offline Download
  const handleSaveOfflineDownload = async (resourceId: string) => {
    if (!user.downloads.includes(resourceId)) {
      setUser(prev => ({ ...prev, downloads: [...prev.downloads, resourceId] }));

      fetch('/api/user/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId }),
      }).catch(err => console.error(err));
    }
  };

  // Record Reading History Progress
  const handleRecordHistory = (resourceId: string, page: number) => {
    fetch('/api/user/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId, page }),
    }).catch(err => console.error(err));
  };

  // Activate Premium Plan
  const handleActivatePremium = (planId: 'monthly' | 'yearly' | 'lifetime') => {
    const updatedUser: UserProfile = {
      ...user,
      isPremium: true,
      premiumPlan: planId,
    };
    setUser(updatedUser);

    fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    }).catch(err => console.error(err));
  };

  // Add Resource (Admin)
  const handleAddResource = async (newRes: Partial<StudyResource>) => {
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRes),
      });
      const created = await res.json();
      setResources(prev => [created, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Resource (Admin)
  const handleDeleteResource = async (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
    fetch(`/api/resources/${id}`, { method: 'DELETE' }).catch(err => console.error(err));
  };

  // Send Announcement (Admin)
  const handleSendAnnouncement = async (ann: Partial<Announcement>) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ann),
      });
      const created = await res.json();
      setAnnouncements(prev => [created, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const appContent = (
    <div
      className={`min-h-full flex flex-col w-full max-w-full overflow-x-hidden ${
        darkTheme ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        user={user}
        isLoggedIn={isUserLoggedIn}
        onOpenLogin={() => setShowUserAuthModal(true)}
        onLogout={handleLogout}
        darkTheme={darkTheme}
        onToggleTheme={() => setDarkTheme(!darkTheme)}
        isDeviceFrame={isDeviceFrame}
        onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
        onOpenAdmin={handleOpenAdminPortal}
        onOpenNotifications={() => setActiveTab('home')}
        onOpenPremium={() => setShowPremiumModal(true)}
        onOpenProfile={() => setActiveTab('profile')}
        announcements={announcements}
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24 overflow-x-hidden">
        {activeTab === 'home' && (
          <HomeScreen
            user={user}
            resources={resources}
            announcements={announcements}
            dailyTips={DAILY_TIPS}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            onOpenResource={handleOpenResource}
            onOpenPremium={() => setShowPremiumModal(true)}
            onOpenAiAssistant={() => setActiveTab('ai')}
            onToggleFavorite={handleToggleFavorite}
            darkTheme={darkTheme}
          />
        )}

        {activeTab === 'search' && (
          <SearchScreen
            resources={resources}
            onOpenResource={handleOpenResource}
            onOpenVoiceSearch={() => setShowVoiceModal(true)}
            darkTheme={darkTheme}
          />
        )}

        {activeTab === 'ai' && <AiAssistantScreen darkTheme={darkTheme} />}

        {activeTab === 'bookmarks' && (
          <BookmarksScreen
            user={user}
            resources={resources}
            onOpenResource={handleOpenResource}
            onToggleFavorite={handleToggleFavorite}
            onToggleBookmark={handleToggleBookmark}
            darkTheme={darkTheme}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            user={user}
            isLoggedIn={isUserLoggedIn}
            onOpenLogin={() => setShowUserAuthModal(true)}
            onLogout={handleLogout}
            onUpdateUser={updated => setUser(prev => ({ ...prev, ...updated }))}
            onOpenPremium={() => setShowPremiumModal(true)}
            onOpenAdmin={handleOpenAdminPortal}
            darkTheme={darkTheme}
            onToggleTheme={() => setDarkTheme(!darkTheme)}
          />
        )}
      </main>

      {/* Banner Ad for Free Users */}
      <div className="fixed bottom-14 sm:bottom-16 left-0 right-0 z-20">
        <BannerAdBar
          isPremium={user.isPremium}
          onOpenPremium={() => setShowPremiumModal(true)}
          darkTheme={darkTheme}
        />
      </div>

      {/* Material Design 3 Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bookmarksCount={user.bookmarks.length}
        darkTheme={darkTheme}
      />

      {/* Modals */}
      {viewerResource && (
        <ResourceViewerModal
          resource={viewerResource}
          user={user}
          onClose={() => setViewerResource(null)}
          onUnlockResource={handleOpenAdUnlock}
          onBookmarkPage={handleToggleBookmark}
          onSaveOfflineDownload={handleSaveOfflineDownload}
          onRecordHistory={handleRecordHistory}
          darkTheme={darkTheme}
        />
      )}

      {adUnlockResource && (
        <RewardedAdModal
          resource={adUnlockResource}
          onClose={() => setAdUnlockResource(null)}
          onAdCompleted={handleAdCompleted}
          onOpenPremium={() => setShowPremiumModal(true)}
        />
      )}

      {showPremiumModal && (
        <PremiumModal
          user={user}
          onClose={() => setShowPremiumModal(false)}
          onActivatePremium={handleActivatePremium}
          darkTheme={darkTheme}
        />
      )}

      {showAdminAuthModal && (
        <AdminAuthModal
          darkTheme={darkTheme}
          onClose={() => setShowAdminAuthModal(false)}
          onSuccess={() => {
            setIsAdminAuthenticated(true);
            setShowAdminAuthModal(false);
            setShowAdminModal(true);
          }}
        />
      )}

      {showAdminModal && (
        <AdminPanelModal
          resources={resources}
          announcements={announcements}
          onClose={() => setShowAdminModal(false)}
          onLogout={() => {
            setIsAdminAuthenticated(false);
            setShowAdminModal(false);
          }}
          onAddResource={handleAddResource}
          onDeleteResource={handleDeleteResource}
          onSendAnnouncement={handleSendAnnouncement}
          darkTheme={darkTheme}
        />
      )}

      {showVoiceModal && (
        <VoiceSearchModal
          onClose={() => setShowVoiceModal(false)}
          onSearchQuery={query => {
            setActiveTab('search');
          }}
        />
      )}

      {showUserAuthModal && (
        <UserAuthModal
          darkTheme={darkTheme}
          onClose={() => setShowUserAuthModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );

  return (
    <AndroidDeviceFrame
      isFrameActive={isDeviceFrame}
      onToggleFrame={() => setIsDeviceFrame(!isDeviceFrame)}
      darkTheme={darkTheme}
    >
      {appContent}
    </AndroidDeviceFrame>
  );
}
