import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatWidget } from '../components/ChatWidget';

export const mountWidget = () => {
  if (document.getElementById('ai-widget-root')) {
    return;
  }

  const script = document.querySelector('script[data-key]') as HTMLScriptElement;
  const projectId = script?.getAttribute('data-key') || '';
  
  const container = document.createElement('div');
  container.id = 'ai-widget-root';
  document.body.appendChild(container);

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <ChatWidget projectId={projectId} />
    </React.StrictMode>
  );
};
