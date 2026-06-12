import { Plus, MessageSquare, Trash2, LogOut, User } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar({
  isOpen,
  onNewChat,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  convLoading,
  user,
  onLogout
}) {
  return (
    <aside className={cn(
      "bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col shrink-0",
      isOpen ? "w-64" : "w-0 overflow-hidden border-0"
    )}>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg transition-colors border border-slate-700 cursor-pointer"
        >
          <Plus size={18} />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="text-xs font-semibold text-slate-500 px-2 uppercase tracking-wider mb-2">
          History
        </div>

        {convLoading && (
          <p className="text-xs text-slate-600 px-2">Loading...</p>
        )}

        {!convLoading && conversations.length === 0 && (
          <p className="text-xs text-slate-600 px-2">No conversations yet.</p>
        )}

        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={cn(
              "group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors cursor-pointer",
              activeConversationId === conv.id
                ? "bg-slate-700"
                : "hover:bg-slate-800"
            )}
            onClick={() => onSelectConversation(conv.id)}
          >
            <MessageSquare
              size={15}
              className={cn(
                "shrink-0",
                activeConversationId === conv.id
                  ? "text-blue-400"
                  : "text-slate-400 group-hover:text-blue-400"
              )}
            />

            {/* Title */}
            <span className={cn(
              "flex-1 truncate text-sm",
              activeConversationId === conv.id
                ? "text-white"
                : "text-slate-300 group-hover:text-white"
            )}>
              {conv.title}
            </span>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded transition-all cursor-pointer shrink-0"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <User size={15} className="text-white" />
          </div>

          {/* Username + Email */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user.username}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer shrink-0"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </aside>
  );
}
