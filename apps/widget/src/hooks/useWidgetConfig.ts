import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { WidgetConfig } from '../types/widget.types';

export const useWidgetConfig = (apiBase: string, projectId: string) => {
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [widgetEnabled, setWidgetEnabled] = useState(false);
  const [initError, setInitError] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setInitError(false);
        const data = await api.initWidget(apiBase, projectId);
        setConfig(data.widget);
        setWidgetEnabled(data.widgetEnabled);
      } catch (error) {
        setInitError(true);
        setWidgetEnabled(false);
        setConfig(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [apiBase, projectId]);

  return { config, loading, widgetEnabled, initError };
};
