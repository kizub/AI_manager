async function main() {
  try {
    const response = await fetch('http://localhost:3005/v1/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        projectId: 'b496f811-33c7-49df-b78d-32e7ae018357',
        message: 'Привіт'
      }),
    });
    console.log('Chat API status:', response.status);
    const data = await response.json();
    console.log('Chat API response:', JSON.stringify(data));
  } catch (err) {
    console.error('Chat API error:', err);
  }
}
main();
