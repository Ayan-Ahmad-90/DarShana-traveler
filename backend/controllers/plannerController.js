const aiService = require('../services/aiService');

exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = await aiService.generateTripSuggestions(req.body);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'AI Service Failed', error: error.message });
  }
};

exports.analyzeMood = async (req, res) => {
  try {
    const analysis = await aiService.analyzeMood(req.body.emotions);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Mood Analysis Failed', error: error.message });
  }
};
