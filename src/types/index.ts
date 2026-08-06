export type EducationLevel = 'school' | 'college';

export type ResourceType =
  | 'notes'
  | 'assignment'
  | 'pyq'
  | 'important_questions'
  | 'sample_paper'
  | 'practical'
  | 'lab_manual'
  | 'question_bank'
  | 'textbook'
  | 'college_resource';

export interface StudyResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  educationLevel: EducationLevel;
  classNum?: number; // 1 to 12
  collegeName?: string;
  semester?: number; // 1 to 8
  department?: string; // e.g. 'Computer Science', 'Electrical', 'Mechanical', 'Civil', 'Commerce', 'Science'
  subject: string;
  author: string;
  fileSize: string;
  pageCount: number;
  isLocked: boolean;
  unlockedUntil?: number; // Timestamp
  viewsCount: number;
  downloadsCount: number;
  rating: number;
  dateAdded: string;
  tags: string[];
  samplePagesText: string[];
  pdfUrl?: string;
  downloadAllowed: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'admin' | 'moderator';
  educationLevel: EducationLevel;
  classNum: number;
  college: string;
  semester: number;
  department: string;
  profilePhoto: string;
  isPremium: boolean;
  premiumPlan: 'none' | 'monthly' | 'yearly' | 'lifetime';
  premiumExpiry?: string;
  favorites: string[]; // Resource IDs
  bookmarks: string[]; // Resource IDs
  downloads: string[]; // Resource IDs
  history: {
    resourceId: string;
    lastReadPage: number;
    timestamp: number;
  }[];
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  category: 'exam' | 'result' | 'notes' | 'system' | 'general';
  important: boolean;
  read?: boolean;
}

export interface DailyTip {
  id: string;
  title: string;
  content: string;
  subject: string;
  author: string;
}

export interface AdSettings {
  adMobEnabled: boolean;
  rewardedAdDurationHours: number; // e.g. 24 hours unlock
  bannerAdsEnabled: boolean;
  adFrequencyLimit: number;
}

export interface PremiumPlan {
  id: 'monthly' | 'yearly' | 'lifetime';
  name: string;
  price: string;
  originalPrice?: string;
  billingPeriod: string;
  popular?: boolean;
  features: string[];
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}
