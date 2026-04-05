import { useState } from 'react';
import { api } from '../lib/api';
import { Message } from '../types/widget.types';

export const useChatMessages = (apiBase: string, projectId: string, sessionId: string | null, setSessionId: (id: string) => void) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (content: string) => {
    setIsSending(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const data = await api.sendMessage(apiBase, projectId, content, sessionId || undefined);
      
      if (!data || !data.reply) {
        throw new Error('Invalid response');
      }

      setQuickReplies(data.quick_replies || []);
      setShowForm(Boolean(data.show_form));

      const assistantMessage: Message = {
        id: Date.now().toString() + '_ai',
        role: 'assistant',
        content: data.reply,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return { messages, sendMessage, quickReplies, showForm, isSending };
};
