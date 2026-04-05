import { useState } from 'react';

const getSessionKey = (projectId: string) => `ai_widget_session_${projectId}`;

export const useChatSession = (projectId: string) => {
  const [sessionId, setSessionIdState] = useState<string | null>(() => {
    return localStorage.getItem(getSessionKey(projectId));
  });

  const setSessionId = (id: string) => {
    setSessionIdState(id);
    localStorage.setItem(getSessionKey(projectId), id);
  };

  return { sessionId, setSessionId };
};
