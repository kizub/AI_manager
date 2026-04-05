import React, { useState, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { QuickReplies } from './QuickReplies';
import { LeadForm } from './LeadForm';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '../types/widget.types';

interface ChatWindowProps {
  messages: Message[];
  sendMessage: (content: string) => void;
  quickReplies: string[];
  showForm: boolean;
  projectId: string;
  sessionId: string;
  isSending: boolean;
  apiBase: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  sendMessage, 
  quickReplies, 
  showForm,
  projectId,
  sessionId,
  isSending,
  apiBase
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLeadFormVisible, setIsLeadFormVisible] = useState(showForm);

  useEffect(() => {
    setIsLeadFormVisible(showForm);
  }, [showForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="ai-chat-window">
      <ChatHeader />
      <MessageList messages={messages} />
      {isSending && <TypingIndicator />}
      <QuickReplies quickReplies={quickReplies} sendMessage={sendMessage} isSending={isSending} />
      {isLeadFormVisible && (
        <LeadForm 
          projectId={projectId} 
          sessionId={sessionId} 
          apiBase={apiBase}
          onSuccess={() => setIsLeadFormVisible(false)} 
        />
      )}
      <form onSubmit={handleSubmit} className="p-2 border-t">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..." 
          disabled={isSending}
          className={`w-full p-2 border rounded ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </form>
    </div>
  );
};
