const ChatHistory = require('../models/ChatHistory');
const UserFeedback = require('../models/UserFeedback');

exports.saveChatHistory = async (req, res) => {
  try {
    const { userId, conversation, category } = req.body;
    const chat = new ChatHistory({
      userId,
      conversation,
      category
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await ChatHistory.find({ userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.saveFeedback = async (req, res) => {
  try {
    const { userId, questionId, responseQuality, relevance, accuracy, comment, liked, disliked } = req.body;
    const feedback = new UserFeedback({
      userId,
      questionId,
      responseQuality,
      relevance,
      accuracy,
      comment,
      liked,
      disliked
    });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const { userId } = req.params;
    const feedback = await UserFeedback.find({ userId });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalChats = await ChatHistory.countDocuments();
    const totalQuestions = await ChatHistory.aggregate([
      { $unwind: '$conversation' },
      { $match: { 'conversation.role': 'user' } },
      { $count: 'total' }
    ]);
    const avgRating = await UserFeedback.aggregate([
      { $group: { _id: null, avgQuality: { $avg: '$responseQuality' } } }
    ]);
    res.json({
      totalChats,
      totalUserQuestions: totalQuestions[0]?.total || 0,
      avgQuality: avgRating[0]?.avgQuality || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
