import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_RESOURCES, INITIAL_ANNOUNCEMENTS, DAILY_TIPS, INITIAL_USER } from './src/data/initialData';
import { StudyResource, Announcement, UserProfile, AdSettings } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory persistent state store for dev/demo runtime
  let resourcesStore: StudyResource[] = [...INITIAL_RESOURCES];
  let announcementsStore: Announcement[] = [...INITIAL_ANNOUNCEMENTS];
  let userStore: UserProfile = { ...INITIAL_USER };
  let adSettingsStore: AdSettings = {
    adMobEnabled: true,
    rewardedAdDurationHours: 24,
    bannerAdsEnabled: true,
    adFrequencyLimit: 3,
  };

  // Initialize Gemini AI Client
  const aiApiKey = process.env.GEMINI_API_KEY || '';
  const ai = aiApiKey ? new GoogleGenAI({
    apiKey: aiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  }) : null;

  // API Routes

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', appName: 'StudyHub', version: '1.0.0' });
  });

  // Get Resources with Filtering
  app.get('/api/resources', (req, res) => {
    let filtered = [...resourcesStore];
    const { level, classNum, semester, type, search, subject, department } = req.query;

    if (level) {
      filtered = filtered.filter(r => r.educationLevel === level);
    }
    if (classNum) {
      filtered = filtered.filter(r => r.classNum === Number(classNum));
    }
    if (semester) {
      filtered = filtered.filter(r => r.semester === Number(semester));
    }
    if (department && department !== 'all') {
      filtered = filtered.filter(r => !r.department || r.department.toLowerCase() === (department as string).toLowerCase());
    }
    if (type && type !== 'all') {
      filtered = filtered.filter(r => r.type === type);
    }
    if (subject) {
      filtered = filtered.filter(r => r.subject.toLowerCase().includes((subject as string).toLowerCase()));
    }
    if (search) {
      const q = (search as string).toLowerCase().trim();
      filtered = filtered.filter(
        r =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q) ||
          r.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Process temporary unlock status
    const now = Date.now();
    const result = filtered.map(r => {
      const isTemporarilyUnlocked = r.unlockedUntil && r.unlockedUntil > now;
      return {
        ...r,
        isLocked: userStore.isPremium ? false : (isTemporarilyUnlocked ? false : r.isLocked),
      };
    });

    res.json(result);
  });

  // Create Resource (Admin)
  app.post('/api/resources', (req, res) => {
    const newRes: StudyResource = {
      id: `res_${Date.now()}`,
      title: req.body.title || 'Untitled Resource',
      description: req.body.description || 'No description provided.',
      type: req.body.type || 'notes',
      educationLevel: req.body.educationLevel || 'college',
      classNum: req.body.classNum ? Number(req.body.classNum) : undefined,
      collegeName: req.body.collegeName || 'Delhi Technological University (DTU)',
      semester: req.body.semester ? Number(req.body.semester) : undefined,
      department: req.body.department || 'Computer Science',
      subject: req.body.subject || 'General Study',
      author: req.body.author || 'StudyHub Admin',
      fileSize: req.body.fileSize || '3.5 MB',
      pageCount: req.body.pageCount ? Number(req.body.pageCount) : 15,
      isLocked: req.body.isLocked !== undefined ? req.body.isLocked : true,
      viewsCount: 0,
      downloadsCount: 0,
      rating: 5.0,
      dateAdded: new Date().toISOString().split('T')[0],
      tags: req.body.tags || ['StudyHub', 'Resource'],
      downloadAllowed: req.body.downloadAllowed !== undefined ? req.body.downloadAllowed : true,
      samplePagesText: req.body.samplePagesText && req.body.samplePagesText.length > 0
        ? req.body.samplePagesText
        : [
            `PAGE 1: ${req.body.title}\nSubject: ${req.body.subject}\nAuthor: ${req.body.author}\n\nIntroduction & Core Concepts:\nThis resource covers detailed explanations, key formulas, diagrams, and step-by-step notes curated specifically for ${req.body.subject}.`,
            `PAGE 2: Key Problem Solving & Practice Examples\n1. Explain the fundamental principles with practical applications.\n2. Important formulas and shortcuts for quick revision prior to mid-term and final examinations.`
          ],
    };

    resourcesStore.unshift(newRes);
    res.status(201).json(newRes);
  });

  // Unlock Resource via Rewarded Ad
  app.post('/api/resources/:id/unlock', (req, res) => {
    const { id } = req.params;
    const resource = resourcesStore.find(r => r.id === id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const durationMs = adSettingsStore.rewardedAdDurationHours * 3600 * 1000;
    resource.unlockedUntil = Date.now() + durationMs;

    res.json({
      success: true,
      unlockedUntil: resource.unlockedUntil,
      message: `Resource unlocked for ${adSettingsStore.rewardedAdDurationHours} hours!`,
    });
  });

  // Delete Resource (Admin)
  app.delete('/api/resources/:id', (req, res) => {
    const { id } = req.params;
    resourcesStore = resourcesStore.filter(r => r.id !== id);
    res.json({ success: true, message: 'Resource removed.' });
  });

  // Get User Profile
  app.get('/api/user', (req, res) => {
    res.json(userStore);
  });

  // Update User Profile
  app.put('/api/user', (req, res) => {
    userStore = { ...userStore, ...req.body };
    res.json(userStore);
  });

  // Toggle Favorite
  app.post('/api/user/favorite', (req, res) => {
    const { resourceId } = req.body;
    if (!resourceId) return res.status(400).json({ error: 'Missing resourceId' });

    if (userStore.favorites.includes(resourceId)) {
      userStore.favorites = userStore.favorites.filter(id => id !== resourceId);
    } else {
      userStore.favorites.push(resourceId);
    }

    res.json({ favorites: userStore.favorites });
  });

  // Toggle Bookmark
  app.post('/api/user/bookmark', (req, res) => {
    const { resourceId } = req.body;
    if (!resourceId) return res.status(400).json({ error: 'Missing resourceId' });

    if (userStore.bookmarks.includes(resourceId)) {
      userStore.bookmarks = userStore.bookmarks.filter(id => id !== resourceId);
    } else {
      userStore.bookmarks.push(resourceId);
    }

    res.json({ bookmarks: userStore.bookmarks });
  });

  // Save Offline Download
  app.post('/api/user/download', (req, res) => {
    const { resourceId } = req.body;
    if (!resourceId) return res.status(400).json({ error: 'Missing resourceId' });

    if (!userStore.downloads.includes(resourceId)) {
      userStore.downloads.push(resourceId);
      // Increment resource download count
      const r = resourcesStore.find(item => item.id === resourceId);
      if (r) r.downloadsCount += 1;
    }

    res.json({ downloads: userStore.downloads });
  });

  // Record Reading History Progress
  app.post('/api/user/history', (req, res) => {
    const { resourceId, page } = req.body;
    if (!resourceId) return res.status(400).json({ error: 'Missing resourceId' });

    // Increment view count
    const r = resourcesStore.find(item => item.id === resourceId);
    if (r) r.viewsCount += 1;

    const existingIdx = userStore.history.findIndex(h => h.resourceId === resourceId);
    if (existingIdx >= 0) {
      userStore.history[existingIdx] = {
        resourceId,
        lastReadPage: page || 1,
        timestamp: Date.now(),
      };
    } else {
      userStore.history.unshift({
        resourceId,
        lastReadPage: page || 1,
        timestamp: Date.now(),
      });
    }

    res.json({ history: userStore.history });
  });

  // Get Announcements
  app.get('/api/announcements', (req, res) => {
    res.json(announcementsStore);
  });

  // Add Announcement (Admin)
  app.post('/api/announcements', (req, res) => {
    const newAnn: Announcement = {
      id: `ann_${Date.now()}`,
      title: req.body.title || 'Notification Alert',
      message: req.body.message || 'New update available on StudyHub.',
      date: new Date().toISOString().split('T')[0],
      category: req.body.category || 'general',
      important: req.body.important || false,
    };
    announcementsStore.unshift(newAnn);
    res.status(201).json(newAnn);
  });

  // Get Daily Tips
  app.get('/api/study-tips', (req, res) => {
    res.json(DAILY_TIPS);
  });

  // Admin Stats
  app.get('/api/admin/stats', (req, res) => {
    res.json({
      totalResources: resourcesStore.length,
      totalViews: resourcesStore.reduce((acc, r) => acc + r.viewsCount, 0),
      totalDownloads: resourcesStore.reduce((acc, r) => acc + r.downloadsCount, 0),
      activeStudents: 14820,
      premiumSubscribers: 1240,
      adRevenueToday: '$142.80',
      adSettings: adSettingsStore,
    });
  });

  // Update Ad Settings (Admin)
  app.post('/api/admin/ad-settings', (req, res) => {
    adSettingsStore = { ...adSettingsStore, ...req.body };
    res.json({ success: true, adSettings: adSettingsStore });
  });

  // AI Doubt Solver API Endpoint (Gemini 3.6 Flash)
  app.post('/api/ai/doubt-solver', async (req, res) => {
    const { question, subject, imageBase64 } = req.body;

    if (!question && !imageBase64) {
      return res.status(400).json({ error: 'Please provide a question or an image' });
    }

    try {
      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured
        return res.json({
          answer: `### Step-by-Step Solution for: ${subject || 'General Problem'}\n\n**Problem Analysis:**\n${question}\n\n1. **Core Concept:** Breakdown of the primary theorem/formula required.\n2. **Detailed Steps:** Step 1: Identify given variables. Step 2: Apply standard rules.\n3. **Final Answer:** Correct mathematical / theoretical result.\n\n*(Note: Attach your GEMINI_API_KEY in Secrets for live AI generation)*`,
          explanation: 'Generated via StudyHub AI Assistant Engine.',
        });
      }

      const promptText = `You are StudyHub's expert AI Tutor for School and College students.
Subject: ${subject || 'General Academic'}
Student Question: ${question}

Provide a clean, encouraging, structured step-by-step academic explanation with key formulas, clear headings, bullet points, and a final concise summary. Keep markdown formatting crisp.`;

      let responseText = '';

      if (imageBase64) {
        // Multimodal image + text
        const imagePart = {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          },
        };
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: { parts: [imagePart, { text: promptText }] },
        });
        responseText = response.text || '';
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: promptText,
        });
        responseText = response.text || '';
      }

      res.json({ answer: responseText });
    } catch (err: any) {
      console.error('Gemini Doubt Solver Error:', err);
      res.status(500).json({ error: err.message || 'Failed to process AI doubt solver query' });
    }
  });

  // AI Text Summarizer API Endpoint
  app.post('/api/ai/summarize', async (req, res) => {
    const { text, subject } = req.body;
    if (!text) return res.status(400).json({ error: 'Text input required for summary' });

    try {
      if (!ai) {
        return res.json({
          summary: `### Quick Study Summary\n- **Topic:** ${subject || 'Study Notes'}\n- **Key Point 1:** Essential definitions and core principles.\n- **Key Point 2:** Crucial formulas and step-by-step problem workflows.\n- **Exam Tip:** Focus on high-weightage derivation steps and standard diagrams.`,
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Summarize the following study content into concise, high-yield revision bullet points for students:\n\n${text}`,
      });

      res.json({ summary: response.text });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI Summarizer failed' });
    }
  });

  // AI Flashcards Generator API Endpoint (Structured JSON)
  app.post('/api/ai/flashcards', async (req, res) => {
    const { topic, subject } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic required for flashcards' });

    try {
      if (!ai) {
        return res.json({
          flashcards: [
            { id: '1', question: `What is the primary definition of ${topic}?`, answer: `${topic} is a core academic principle used to model complex behaviors in ${subject || 'Science/Engineering'}.`, category: subject || 'General' },
            { id: '2', question: `What are the key components of ${topic}?`, answer: `Key components include inputs, structural parameters, transformation steps, and measurable output results.`, category: subject || 'General' },
            { id: '3', question: `How is ${topic} applied in exam problems?`, answer: `Focus on standard derivations, unit conversions, and formula substitutions.`, category: subject || 'General' },
          ],
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Generate 4 high-yield study flashcards for the topic: "${topic}" in subject: "${subject || 'Academic'}".`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                category: { type: Type.STRING },
              },
              required: ['id', 'question', 'answer', 'category'],
            },
          },
        },
      });

      const json = JSON.parse(response.text || '[]');
      res.json({ flashcards: json });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI Flashcard Generation failed' });
    }
  });

  // AI Practice Quiz Generator API Endpoint (Structured JSON)
  app.post('/api/ai/quiz', async (req, res) => {
    const { topic, subject } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic required for quiz generation' });

    try {
      if (!ai) {
        return res.json({
          quiz: [
            {
              id: 'q1',
              question: `Which of the following best describes ${topic}?`,
              options: ['A fundamental physical constant', 'A systematic methodological framework', 'A deprecated compiler directive', 'An auxiliary hardware register'],
              correctOptionIndex: 1,
              explanation: `${topic} provides a structured theoretical framework commonly used in ${subject || 'studies'}.`,
            },
            {
              id: 'q2',
              question: `What is a crucial advantage of utilizing ${topic}?`,
              options: ['Improves system clarity and consistency', 'Eliminates all compute time', 'Bypasses memory allocation', 'Does not require validation'],
              correctOptionIndex: 0,
              explanation: `Proper application ensures structured clarity and reduces errors in exams and practice problems.`,
            },
          ],
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Create 3 multiple-choice practice exam questions for topic "${topic}" in subject "${subject || 'General'}". Provide 4 options, the 0-indexed correct option, and a clear step-by-step explanation.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctOptionIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['id', 'question', 'options', 'correctOptionIndex', 'explanation'],
            },
          },
        },
      });

      const json = JSON.parse(response.text || '[]');
      res.json({ quiz: json });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'AI Quiz Generation failed' });
    }
  });

  // Vite Middleware integration for dev / static for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyHub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
