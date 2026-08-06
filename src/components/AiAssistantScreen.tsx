import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Upload,
  Image as ImageIcon,
  HelpCircle,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  BookOpen,
} from 'lucide-react';
import { Flashcard, QuizQuestion } from '../types';

interface AiAssistantScreenProps {
  darkTheme: boolean;
}

export const AiAssistantScreen: React.FC<AiAssistantScreenProps> = ({ darkTheme }) => {
  const [activeTool, setActiveTool] = useState<'doubt' | 'summarize' | 'flashcards' | 'quiz'>('doubt');

  // Doubt Solver state
  const [doubtText, setDoubtText] = useState('');
  const [doubtSubject, setDoubtSubject] = useState('Computer Science');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [doubtAnswer, setDoubtAnswer] = useState<string | null>(null);
  const [loadingDoubt, setLoadingDoubt] = useState(false);

  // Summarizer state
  const [summaryInput, setSummaryInput] = useState('');
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Flashcards state
  const [flashcardTopic, setFlashcardTopic] = useState('Software Engineering Patterns');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [loadingCards, setLoadingCards] = useState(false);

  // Quiz state
  const [quizTopic, setQuizTopic] = useState('Database Management Systems');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // Handle Image Upload for Doubt Solver
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Doubt Solver
  const handleSolveDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText && !imagePreview) return;

    setLoadingDoubt(true);
    setDoubtAnswer(null);

    try {
      const res = await fetch('/api/ai/doubt-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: doubtText,
          subject: doubtSubject,
          imageBase64: imagePreview,
        }),
      });
      const data = await res.json();
      setDoubtAnswer(data.answer || 'Failed to generate solution.');
    } catch (err) {
      setDoubtAnswer('Error connecting to AI service. Please try again.');
    } finally {
      setLoadingDoubt(false);
    }
  };

  // Submit Summarizer
  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summaryInput) return;

    setLoadingSummary(true);
    setSummaryResult(null);

    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summaryInput, subject: doubtSubject }),
      });
      const data = await res.json();
      setSummaryResult(data.summary || 'Summary unavailable.');
    } catch (err) {
      setSummaryResult('Error generating summary.');
    } finally {
      setLoadingSummary(false);
    }
  };

  // Generate Flashcards
  const handleGenerateCards = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flashcardTopic) return;

    setLoadingCards(true);
    setFlippedCards({});

    try {
      const res = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: flashcardTopic, subject: doubtSubject }),
      });
      const data = await res.json();
      setFlashcards(data.flashcards || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCards(false);
    }
  };

  // Generate Quiz
  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTopic) return;

    setLoadingQuiz(true);
    setSelectedAnswers({});
    setQuizSubmitted(false);

    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: quizTopic, subject: doubtSubject }),
      });
      const data = await res.json();
      setQuizQuestions(data.quiz || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuiz(false);
    }
  };

  return (
    <div className="pb-20 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/20 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md">
            <Bot className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">PadhaiAdda AI Study Assistant</h1>
            <p className="text-xs text-indigo-100/90">
              Powered by Gemini AI • Ask doubts, generate revision cards & practice quizzes
            </p>
          </div>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'doubt', label: 'AI Doubt Solver', icon: HelpCircle },
          { id: 'summarize', label: 'AI Summarizer', icon: FileText },
          { id: 'flashcards', label: 'Flashcards', icon: BrainCircuit },
          { id: 'quiz', label: 'Practice Quiz', icon: BookOpen },
        ].map(tool => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition active:scale-95 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                  : darkTheme
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-bold">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: AI DOUBT SOLVER */}
      {activeTool === 'doubt' && (
        <div
          className={`p-5 rounded-3xl border ${
            darkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          } shadow-sm space-y-4`}
        >
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Instant AI Step-by-Step Doubt Solver
          </h2>

          <form onSubmit={handleSolveDoubt} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Select Subject
              </label>
              <select
                value={doubtSubject}
                onChange={e => setDoubtSubject(e.target.value)}
                className={`w-full p-2.5 rounded-xl text-xs border font-medium focus:outline-none ${
                  darkTheme ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Commerce & Accounting">Commerce & Accounting</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Type Question or Problem Statement
              </label>
              <textarea
                value={doubtText}
                onChange={e => setDoubtText(e.target.value)}
                placeholder="e.g. Derive the prism minimum deviation formula OR solve 3NF normalization problem..."
                className={`w-full p-3 rounded-2xl text-xs border focus:outline-none focus:border-indigo-500 ${
                  darkTheme ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
                rows={3}
              />
            </div>

            {/* Photo Attachment Option */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>{imagePreview ? 'Change Problem Image' : 'Upload Problem Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-700">
                  <img src={imagePreview} alt="Problem Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-0 right-0 p-0.5 bg-red-600 text-white rounded-bl"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loadingDoubt || (!doubtText && !imagePreview)}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingDoubt ? (
                <span>Solving with Gemini AI...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Get Step-by-Step AI Solution</span>
                </>
              )}
            </button>
          </form>

          {/* Solution Output Box */}
          {doubtAnswer && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                AI Tutor Verified Solution
              </h3>
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-200">
                {doubtAnswer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 2: AI SUMMARIZER */}
      {activeTool === 'summarize' && (
        <div
          className={`p-5 rounded-3xl border ${
            darkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          } shadow-sm space-y-4`}
        >
          <h2 className="text-sm font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-500" />
            AI High-Yield Notes & Topic Summarizer
          </h2>

          <form onSubmit={handleSummarize} className="space-y-3">
            <textarea
              value={summaryInput}
              onChange={e => setSummaryInput(e.target.value)}
              placeholder="Paste long textbook paragraphs, lecture transcripts, or notes here..."
              className={`w-full p-3 rounded-2xl text-xs border focus:outline-none focus:border-indigo-500 ${
                darkTheme ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
              rows={5}
              required
            />

            <button
              type="submit"
              disabled={loadingSummary || !summaryInput}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition disabled:opacity-50"
            >
              {loadingSummary ? 'Summarizing...' : 'Generate Revision Bullet Points'}
            </button>
          </form>

          {summaryResult && (
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase text-emerald-400">
                High-Yield Summary
              </h3>
              <div className="text-xs leading-relaxed whitespace-pre-wrap text-slate-200">
                {summaryResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 3: AI FLASHCARDS */}
      {activeTool === 'flashcards' && (
        <div
          className={`p-5 rounded-3xl border ${
            darkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          } shadow-sm space-y-4`}
        >
          <h2 className="text-sm font-bold flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            Interactive AI Study Flashcards
          </h2>

          <form onSubmit={handleGenerateCards} className="space-y-3">
            <input
              type="text"
              value={flashcardTopic}
              onChange={e => setFlashcardTopic(e.target.value)}
              placeholder="Enter Topic (e.g. AC Circuits, Normalization, Photosynthesis)..."
              className={`w-full p-3 rounded-2xl text-xs border focus:outline-none focus:border-purple-500 ${
                darkTheme ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
              required
            />

            <button
              type="submit"
              disabled={loadingCards || !flashcardTopic}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition disabled:opacity-50"
            >
              {loadingCards ? 'Generating Flashcards...' : 'Generate Flashcards'}
            </button>
          </form>

          {/* Flashcards Flip Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {flashcards.map(card => {
              const isFlipped = flippedCards[card.id];
              return (
                <div
                  key={card.id}
                  onClick={() =>
                    setFlippedCards(prev => ({ ...prev, [card.id]: !prev[card.id] }))
                  }
                  className={`p-5 rounded-2xl border transition-all cursor-pointer min-h-[140px] flex flex-col justify-between ${
                    isFlipped
                      ? 'bg-purple-950/80 border-purple-500 text-white'
                      : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-purple-500/50'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      {isFlipped ? 'Answer' : 'Question (Tap to Reveal)'}
                    </span>
                    <p className="text-xs font-semibold leading-relaxed">
                      {isFlipped ? card.answer : card.question}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-700/50">
                    <span>{card.category}</span>
                    <span className="flex items-center gap-1 font-bold text-purple-400">
                      <RotateCcw className="w-3 h-3" /> Flip Card
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TOOL 4: AI PRACTICE QUIZ */}
      {activeTool === 'quiz' && (
        <div
          className={`p-5 rounded-3xl border ${
            darkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          } shadow-sm space-y-4`}
        >
          <h2 className="text-sm font-bold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            AI Practice Quiz Generator
          </h2>

          <form onSubmit={handleGenerateQuiz} className="space-y-3">
            <input
              type="text"
              value={quizTopic}
              onChange={e => setQuizTopic(e.target.value)}
              placeholder="Enter Quiz Subject / Topic..."
              className={`w-full p-3 rounded-2xl text-xs border focus:outline-none focus:border-blue-500 ${
                darkTheme ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
              required
            />

            <button
              type="submit"
              disabled={loadingQuiz || !quizTopic}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition disabled:opacity-50"
            >
              {loadingQuiz ? 'Creating Quiz...' : 'Generate 3-Question Practice Test'}
            </button>
          </form>

          {/* Quiz Questions List */}
          {quizQuestions.length > 0 && (
            <div className="space-y-4 pt-2">
              {quizQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3"
                >
                  <h3 className="text-xs font-bold text-white">
                    Q{idx + 1}. {q.question}
                  </h3>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      const isCorrect = q.correctOptionIndex === optIdx;

                      let btnStyle = 'bg-slate-900/60 border-slate-700 text-slate-300';
                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                        else if (isSelected && !isCorrect)
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-600 text-white font-bold border-indigo-600';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() =>
                            setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`w-full text-left p-2.5 rounded-xl text-xs border transition ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-xl bg-slate-900/90 text-xs text-slate-300 border border-slate-700">
                      <span className="font-bold text-amber-400">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg active:scale-95 transition"
                >
                  Submit & Check Score
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-center space-y-1">
                  <h4 className="text-xs font-extrabold text-indigo-300">Test Completed!</h4>
                  <p className="text-[11px] text-slate-300">
                    Your Score:{' '}
                    {
                      quizQuestions.filter(
                        q => selectedAnswers[q.id] === q.correctOptionIndex
                      ).length
                    }{' '}
                    / {quizQuestions.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
