import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn("flex gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
          <Bot size={16} className="text-blue-400" />
        </div>
      )}

      <div className={cn(
        "p-4 max-w-[80%] rounded-2xl leading-relaxed",
        isUser
          ? "bg-blue-600 text-white rounded-br-none whitespace-pre-wrap"
          : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
      )}>
        {isUser ? message.text : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-bold mb-1">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-slate-200">{children}</li>,
              code: ({ inline, children }) => inline
                ? <code className="bg-slate-700 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                : <code className="block bg-slate-900 text-blue-300 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-2">{children}</code>,
              pre: ({ children }) => <pre className="bg-slate-900 rounded-lg mb-2 overflow-x-auto">{children}</pre>,
              blockquote: ({ children }) => <blockquote className="border-l-2 border-blue-400 pl-3 text-slate-400 italic mb-2">{children}</blockquote>,
              a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{children}</a>,
              strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
              hr: () => <hr className="border-slate-600 my-3" />,
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
          <User size={16} className="text-slate-300" />
        </div>
      )}
    </div>
  );
}
