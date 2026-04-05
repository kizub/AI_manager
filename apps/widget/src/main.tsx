import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatWidget } from './components/ChatWidget';
import './styles/widget.css';

const mountWidget = () => {
  const script =
    (document.currentScript as HTMLScriptElement) ||
    (document.querySelector('script[data-key]') as HTMLScriptElement);
  const projectId = script?.getAttribute('data-key') || '';
  const apiBase = script?.getAttribute('data-api') || '';

  if (!projectId) {
    return;
  }

  if (!apiBase) {
    return;
  }

  let container = document.getElementById('ai-widget-root');

  if (!container) {
    container = document.createElement('div');
    container.id = 'ai-widget-root';
    document.body.appendChild(container);
  }

  if (container.getAttribute('data-mounted') === 'true') {
    return;
  }

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <ChatWidget projectId={projectId} apiBase={apiBase} />
    </React.StrictMode>
  );

  container.setAttribute('data-mounted', 'true');
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountWidget);
} else {
  mountWidget();
}
