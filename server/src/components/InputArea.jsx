import { useState } from 'react';
import { Send } from 'lucide-react';
import ModelSelector from './ModelSelector';

export default function InputArea({ onSend, disabled, selectedModel, onModelChange }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-slate-950 border-t border-slate-800">
      <div className="max-w-3xl mx-auto bg-slate-900 rounded-xl border border-slate-700 shadow-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message GemBot..."
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 p-4 max-h-48 min-h-[60px] resize-none focus:outline-none"
          rows={1}
        />
        <div className="flex justify-between items-center p-2 bg-slate-900/50">
          <ModelSelector selectedModel={selectedModel} onSelect={onModelChange} />
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      <div className="text-center mt-2 text-xs text-slate-600">
        GemBot can make mistakes. Consider checking important information.
      </div>
    </div>
  );
}

