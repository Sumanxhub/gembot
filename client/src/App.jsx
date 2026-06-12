import { useState, useRef, useEffect } from 'react';
import { Settings2, Bot } from 'lucide-react';
import { MODELS } from './components/ModelSelector';
import { useChat } from './hooks/useChat';
import { useAuth } from './hooks/useAuth';

// Components
import Sidebar from './components/Sidebar';
import ChatBubble from './components/ChatBubble';
import WelcomeScreen from './components/WelcomeScreen';
import InputArea from './components/InputArea';
import AuthPage from './components/AuthPage';

const API = 'http://localhost:3001/api';

function App() {
  const { user, authLoading, login, register, logout } = useAuth();
  const { messages, isLoading, sendMessage, clearChat, loadConversation, activeConversationId } = useChat();

  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [convLoading, setConvLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load conversations when user logs in
  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  // Refresh sidebar after a new message creates a conversation
  useEffect(() => {
    if (activeConversationId) fetchConversations();
  }, [activeConversationId]);

  const fetchConversations = async () => {
    setConvLoading(true);
    try {
      const res = await fetch(`${API}/conversations`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setConversations(data.conversations);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setConvLoading(false);
    }
  };

  const handleNewChat = () => {
    clearChat();
  };

  const handleSelectConversation = (id) => {
    loadConversation(id);
  };

  const handleDeleteConversation = async (id) => {
    try {
      await fetch(`${API}/conversations/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConversationId === id) clearChat();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    clearChat();
    setConversations([]);
  };

  // Show nothing while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage onLogin={login} onRegister={register} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onNewChat={handleNewChat}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        convLoading={convLoading}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Layout */}
      <main className="flex-1 flex flex-col relative h-full">

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-4 z-10 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md cursor-pointer"
        >
          <Settings2 size={20} />
        </button>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            {messages.length === 0 ? (
              <WelcomeScreen
                onSuggestionClick={(text) => sendMessage(text, selectedModel.id)}
              />
            ) : (
              <div className="space-y-6 pb-4">
                {messages.map((msg, index) => (
                  <ChatBubble key={index} message={msg} />
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                      <Bot size={16} className="text-blue-400" />
                    </div>
                    <div className="flex gap-1 items-center h-8 px-4">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <InputArea
          onSend={(text) => sendMessage(text, selectedModel.id)}
          disabled={isLoading}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </main>
    </div>
  );
}

export default App;
