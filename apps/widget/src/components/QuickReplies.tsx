import React from 'react';

interface QuickRepliesProps {
  quickReplies: string[];
  sendMessage: (text: string) => void;
  isSending: boolean;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ quickReplies, sendMessage, isSending }) => {
  return (
    <div className="p-2 border-t flex gap-2 overflow-x-auto">
      {quickReplies.map((text, index) => (
        <button
          key={index}
          disabled={isSending}
          onClick={() => {
            if (isSending) return;
            sendMessage(text);
          }}
          className={`px-3 py-1 bg-blue-500 text-white rounded-full text-sm whitespace-nowrap ${
            isSending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
};
