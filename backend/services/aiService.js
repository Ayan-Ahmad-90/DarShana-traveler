const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateTripSuggestions = async (preferences) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    Act as an expert travel planner.
    User preferences:
    - Budget: ${preferences.budget}
    - Mood: ${preferences.mood}
    - Duration: ${preferences.duration} days
    - Interests: ${preferences.interests ? preferences.interests.join(', ') : 'General'}
    
    Suggest 3 detailed travel destinations in India.
    Return ONLY a JSON array with this structure:
    [
      {
        "name": "City, State",
        "description": "Why it fits",
        "estimatedCost": 15000,
        "bestTime": "Oct-Mar",
        "activities": ["activity1", "activity2"]
      }
    ]
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Extract JSON from text (handle potential markdown code blocks)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error('AI Parse Error:', e);
    throw new Error('Failed to parse AI response');
  }
};

exports.analyzeMood = async (emotions) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `
    Analyze these facial emotions: ${JSON.stringify(emotions)}.
    Determine the user's mood and suggest a travel vibe.
    Return JSON: { "mood": "Relaxed", "vibe": "Beach or Hill Station", "reasoning": "..." }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error('AI Parse Error:', e);
    throw new Error('Failed to parse AI response');
  }
};
