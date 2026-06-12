import { Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Explain React Hooks', 
  'Write a Python Script', 
  'Debug this code', 
  'Creative Writing'
];

export default function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="h-full flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/10 animate-pulse">
        <Sparkles className="w-8 h-8 text-blue-400" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Hello, I'm GemBot
      </h1>
      <p className="text-slate-400 text-lg max-w-md">
        How can I help you today? Select a model below and start chatting.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mt-8">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 rounded-xl text-left text-slate-300 text-sm transition-all cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

