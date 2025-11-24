const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchQuestionsFromDB(category?: string) {
  try {
    const url = category 
      ? `${API_BASE_URL}/questions/category/${category}` 
      : `${API_BASE_URL}/questions`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

export async function saveChatToDB(userId: string, messages: any[], category?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        conversation: messages,
        category
      })
    });
    if (!response.ok) throw new Error('Failed to save chat');
    return await response.json();
  } catch (error) {
    console.error('Error saving chat:', error);
    return null;
  }
}

export async function getChatHistory(userId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/history/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}

export async function saveFeedback(userId: string, feedback: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        ...feedback
      })
    });
    if (!response.ok) throw new Error('Failed to save feedback');
    return await response.json();
  } catch (error) {
    console.error('Error saving feedback:', error);
    return null;
  }
}

export async function searchQuestions(q: string, category?: string) {
  try {
    const params = new URLSearchParams({ q });
    if (category) params.append('category', category);
    const response = await fetch(`${API_BASE_URL}/questions/search?${params}`);
    if (!response.ok) throw new Error('Failed to search questions');
    return await response.json();
  } catch (error) {
    console.error('Error searching questions:', error);
    return [];
  }
}

export async function getStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/stats/analytics`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}
