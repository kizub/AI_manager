import React from 'react';

export const MessageBubble: React.FC<{ role: 'user' | 'assistant'; content: string }> = ({ role, content }) => {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[80%] p-2 rounded-lg ${isUser ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {content}
      </div>
    </div>
  );
};
