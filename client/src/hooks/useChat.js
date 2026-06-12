import { useState } from 'react';

const API = 'http://localhost:3001/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const sendMessage = async (input, modelId) => {
    if (!input.trim()) return;

    // Optimistically add user message to UI
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          conversation_id: activeConversationId,
          message: input,
          model_id: modelId || 'gemini-2.5-flash'
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Server error.');

      // If new conversation was auto-created, store its id
      if (!activeConversationId && data.conversation_id) {
        setActiveConversationId(data.conversation_id);
      }

      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);

      return data.conversation_id;

    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'model', text: err.message || 'Could not connect to server.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load an existing conversation from DB
  const loadConversation = async (conversationId) => {
    try {
      const res = await fetch(`${API}/conversations/${conversationId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActiveConversationId(conversationId);
      setMessages(data.messages.map(msg => ({
        role: msg.role,
        text: msg.text
      })));
    } catch (err) {
      console.error('Load conversation error:', err);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setActiveConversationId(null);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    loadConversation,
    activeConversationId
  };
}
