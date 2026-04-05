export const api = {
  initWidget: async (apiBase: string, projectId: string) => {
    const response = await fetch(`${apiBase}/v1/widget/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    });
    return response.json();
  },
  sendMessage: async (apiBase: string, projectId: string, message: string, sessionToken?: string) => {
    const response = await fetch(`${apiBase}/v1/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, message, sessionToken }),
    });
    return response.json();
  },
  submitLead: async (apiBase: string, projectId: string, sessionToken: string, name: string, email: string) => {
    const response = await fetch(`${apiBase}/v1/chat/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, sessionToken, name, email }),
    });
    return response.json();
  },
  getHistory: async () => {},
};
