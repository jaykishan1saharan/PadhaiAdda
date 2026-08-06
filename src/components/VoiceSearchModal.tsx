import React, { useState, useEffect } from 'react';
import { Mic, X, Sparkles } from 'lucide-react';

interface VoiceSearchModalProps {
  onClose: () => void;
  onSearchQuery: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ onClose, onSearchQuery }) => {
  const [listeningText, setListeningText] = useState('Listening to your voice...');
  const sampleVoicePrompts = [
    'Software Engineering Notes',
    'DBMS Previous Year Question Papers',
    'Class 12 Physics Derivations',
    'Computer Networks Lab Manual',
  ];

  useEffect(() => {
    const randomPrompt = sampleVoicePrompts[Math.floor(Math.random() * sampleVoicePrompts.length)];
    const timer = setTimeout(() => {
      setListeningText(`Recognized: "${randomPrompt}"`);
      setTimeout(() => {
        onSearchQuery(randomPrompt);
        onClose();
      }, 1200);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl relative text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 relative z-10">
            <Mic className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-indigo-400">PadhaiAdda Voice Assistant</h3>
          <p className="text-xs text-slate-300 font-medium">{listeningText}</p>
        </div>
      </div>
    </div>
  );
};
