import React, { useState } from 'react';
import { LauncherButton } from './LauncherButton';
import { ChatWindow } from './ChatWindow';
import { useWidgetConfig } from '../hooks/useWidgetConfig';
import { useChatSession } from '../hooks/useChatSession';
import { useChatMessages } from '../hooks/useChatMessages';
import '../styles/widget.css';

export const ChatWidget: React.FC<{ projectId: string; apiBase: string }> = ({ projectId, apiBase }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, widgetEnabled, initError } = useWidgetConfig(apiBase, projectId);
  const { sessionId, setSessionId } = useChatSession(projectId);
  const { messages, sendMessage, quickReplies, showForm, isSending } = useChatMessages(apiBase, projectId, sessionId, setSessionId);

  if (loading || !widgetEnabled) {
    return null;
  }

  return (
    <div className="ai-widget-container">
      {isOpen && (
        <ChatWindow 
          messages={messages} 
          sendMessage={sendMessage} 
          quickReplies={quickReplies} 
          showForm={showForm}
          projectId={projectId}
          sessionId={sessionId || ''}
          isSending={isSending}
          apiBase={apiBase}
        />
      )}
      <LauncherButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </div>
  );
};
