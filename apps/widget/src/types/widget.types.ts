export interface WidgetConfig {
  projectId: string;
  theme?: {
    primaryColor?: string;
    launcherIcon?: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface InitResponse {
  widgetEnabled: boolean;
  project: {
    id: string;
    name: string;
  };
  ai: {
    model?: string;
    prompt?: string;
  };
  widget: WidgetConfig | null;
}

export interface ChatState {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
}
