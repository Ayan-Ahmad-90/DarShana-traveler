import * as aiService from '../services/aiService.js';

export const analyzeMood = async (req, res) => {
  try {
    const { emotions } = req.body;
    
    if (!emotions) {
      return res.status(400).json({ message: 'Emotions data is required' });
    }

    const result = await aiService.analyzeMood(emotions);
    res.json(result);
  } catch (error) {
    console.error('Mood analysis error:', error);
    res.status(500).json({ message: 'Failed to analyze mood', error: error.message });
  }
};
