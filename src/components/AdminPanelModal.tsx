import React, { useState } from 'react';
import {
  X,
  Shield,
  Upload,
  BarChart3,
  FileText,
  Bell,
  Trash2,
  DollarSign,
  Users,
  Eye,
  Download,
  Check,
  Plus,
  Settings,
} from 'lucide-react';
import { StudyResource, Announcement, ResourceType, EducationLevel } from '../types';

interface AdminPanelModalProps {
  resources: StudyResource[];
  announcements: Announcement[];
  onClose: () => void;
  onLogout?: () => void;
  onAddResource: (newResource: Partial<StudyResource>) => void;
  onDeleteResource: (id: string) => void;
  onSendAnnouncement: (ann: Partial<Announcement>) => void;
  darkTheme: boolean;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  resources,
  announcements,
  onClose,
  onLogout,
  onAddResource,
  onDeleteResource,
  onSendAnnouncement,
  darkTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'upload' | 'manage' | 'announcements' | 'ads'>('stats');

  // Resource Upload Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ResourceType>('notes');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('college');
  const [classNum, setClassNum] = useState<number>(12);
  const [semester, setSemester] = useState<number>(5);
  const [department, setDepartment] = useState<string>('Computer Science');
  const [subject, setSubject] = useState('');
  const [author, setAuthor] = useState('Faculty Member');
  const [fileSize, setFileSize] = useState('3.8 MB');
  const [pageCount, setPageCount] = useState<number>(24);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [sampleContent, setSampleContent] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annCategory, setAnnCategory] = useState<'exam' | 'result' | 'notes' | 'system' | 'general'>('exam');
  const [annImportant, setAnnImportant] = useState(true);

  // Ad Settings State
  const [adMobEnabled, setAdMobEnabled] = useState(true);
  const [unlockHours, setUnlockHours] = useState(24);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject) return;

    onAddResource({
      title,
      description: description || 'High-quality verified study notes & solutions.',
      type,
      educationLevel,
      classNum: educationLevel === 'school' ? classNum : undefined,
      semester: educationLevel === 'college' ? semester : undefined,
      department: educationLevel === 'college' ? department : undefined,
      subject,
      author,
      fileSize,
      pageCount,
      isLocked,
      samplePagesText: sampleContent
        ? [sampleContent]
        : [`PAGE 1: ${title}\nSubject: ${subject}\nAuthor: ${author}\n\nKey Notes & Formula Summary.`],
    });

    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setTitle('');
      setDescription('');
      setSubject('');
      setSampleContent('');
    }, 1500);
  };

  const handleAnnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMessage) return;

    onSendAnnouncement({
      title: annTitle,
      message: annMessage,
      category: annCategory,
      important: annImportant,
    });

    setAnnTitle('');
    setAnnMessage('');
    alert('Push alert dispatched successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="w-full max-w-2xl my-6 p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">PadhaiAdda Admin Portal</h2>
              <p className="text-[11px] text-slate-400">
                Resource Uploads, Ads Control & Student Notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                onClick={onLogout}
                title="Lock Admin Session"
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition"
              >
                <span>Lock Session</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-2xl overflow-x-auto text-xs font-bold scrollbar-none">
          {[
            { id: 'stats', label: 'Analytics', icon: BarChart3 },
            { id: 'upload', label: 'Upload PDF', icon: Upload },
            { id: 'manage', label: 'Manage Resources', icon: FileText },
            { id: 'announcements', label: 'Alerts', icon: Bell },
            { id: 'ads', label: 'AdMob Settings', icon: Settings },
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap transition ${
                  isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS */}
        {activeTab === 'stats' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                <FileText className="w-5 h-5 text-indigo-400 mb-1" />
                <span className="text-xl font-extrabold">{resources.length}</span>
                <p className="text-[10px] text-slate-400 font-semibold">Total Resources</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                <Eye className="w-5 h-5 text-blue-400 mb-1" />
                <span className="text-xl font-extrabold">
                  {resources.reduce((acc, r) => acc + r.viewsCount, 0)}
                </span>
                <p className="text-[10px] text-slate-400 font-semibold">Total Views</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                <Download className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="text-xl font-extrabold">
                  {resources.reduce((acc, r) => acc + r.downloadsCount, 0)}
                </span>
                <p className="text-[10px] text-slate-400 font-semibold">PDF Downloads</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                <DollarSign className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-xl font-extrabold">$142.80</span>
                <p className="text-[10px] text-slate-400 font-semibold">AdMob Revenue (Today)</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UPLOAD PDF */}
        {activeTab === 'upload' && (
          <form onSubmit={handleUpload} className="space-y-3.5 text-xs animate-fadeIn">
            {uploadSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-center font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Resource Published Successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Resource Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Operating Systems Hand-written Notes"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Operating Systems"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Level</label>
                <select
                  value={educationLevel}
                  onChange={e => setEducationLevel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700"
                >
                  <option value="school">School</option>
                  <option value="college">College</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700"
                >
                  <option value="notes">Notes</option>
                  <option value="pyq">PYQ Paper</option>
                  <option value="assignment">Assignment</option>
                  <option value="lab_manual">Lab Manual</option>
                  <option value="important_questions">Important Qs</option>
                </select>
              </div>

              {educationLevel === 'school' ? (
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Class (1-12)</label>
                  <input
                    type="number"
                    value={classNum}
                    onChange={e => setClassNum(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Semester (1-8)</label>
                  <input
                    type="number"
                    value={semester}
                    onChange={e => setSemester(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-400 font-bold block mb-1">Lock via Ad?</label>
                <select
                  value={isLocked ? 'yes' : 'no'}
                  onChange={e => setIsLocked(e.target.value === 'yes')}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700"
                >
                  <option value="yes">Locked (Ad Mob)</option>
                  <option value="no">Free Open Access</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Short summary of chapter contents..."
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">
                Sample Page Text / Notes Excerpt
              </label>
              <textarea
                value={sampleContent}
                onChange={e => setSampleContent(e.target.value)}
                placeholder="Enter text contents of the PDF document..."
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg active:scale-95 transition"
            >
              Publish New Resource
            </button>
          </form>
        )}

        {/* TAB 3: MANAGE RESOURCES */}
        {activeTab === 'manage' && (
          <div className="space-y-2 max-h-80 overflow-y-auto animate-fadeIn">
            {resources.map(res => (
              <div
                key={res.id}
                className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold truncate">{res.title}</h4>
                  <p className="text-[10px] text-slate-400">
                    {res.subject} • {res.educationLevel}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteResource(res.id)}
                  className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                  title="Delete Resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <form onSubmit={handleAnnSubmit} className="space-y-3 text-xs animate-fadeIn">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Alert Title</label>
              <input
                type="text"
                value={annTitle}
                onChange={e => setAnnTitle(e.target.value)}
                placeholder="e.g. End-Sem Exam Timetable Released"
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Alert Message</label>
              <textarea
                value={annMessage}
                onChange={e => setAnnMessage(e.target.value)}
                placeholder="Details of the announcement..."
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700"
                rows={3}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg transition"
            >
              Dispatch Push Notification Alert
            </button>
          </form>
        )}

        {/* TAB 5: ADMOB SETTINGS */}
        {activeTab === 'ads' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span>Google AdMob Integration</span>
                <button
                  onClick={() => setAdMobEnabled(!adMobEnabled)}
                  className={`px-3 py-1 rounded-xl font-bold ${
                    adMobEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {adMobEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 block font-bold">
                  Rewarded Ad Unlock Duration (Hours)
                </label>
                <input
                  type="number"
                  value={unlockHours}
                  onChange={e => setUnlockHours(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
