import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatWidget } from '../components/ChatWidget';
import widgetStyles from '../styles/widget.css?inline';

const injectStyles = (styleId: string) => {
if (document.getElementById(styleId)) {
return;
}

const style = document.createElement('style');
style.id = styleId;
style.textContent = widgetStyles;
document.head.appendChild(style);
};

const getWidgetScript = (): HTMLScriptElement | null => {
if (document.currentScript instanceof HTMLScriptElement) {
return document.currentScript;
}

const scripts = document.querySelectorAll('script[data-key][data-api]');

if (scripts.length > 0) {
return scripts[scripts.length - 1] as HTMLScriptElement;
}

return null;
};

const getSafeId = (id: string): string => {
return id.replace(/[^a-zA-Z0-9_-]/g, '-');
};

const mountWidget = () => {
if (!document.body) {
return;
}

try {
const script = getWidgetScript();
const projectId = script?.getAttribute('data-key') || '';
const apiBase = script?.getAttribute('data-api') || '';

if (!projectId || !apiBase) {
  return;
}

const safeProjectId = getSafeId(projectId);
const rootId = `ai-widget-root-${safeProjectId}`;
const styleId = `ai-widget-styles-${safeProjectId}`;

injectStyles(styleId);

let container = document.getElementById(rootId);

if (!container) {
  container = document.createElement('div');
  container.id = rootId;
  document.body.appendChild(container);
} else if (!document.body.contains(container)) {
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

} catch (error) {
console.error('[AIWidget] mount failed', error);
}
};

if (!(window as any).AIWidgetInitialized) {
(window as any).AIWidgetInitialized = true;
(window as any).AIWidget = {
mount: mountWidget,
};

if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', mountWidget);
} else {
mountWidget();
}
}
