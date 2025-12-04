const Question = require('../models/Question');

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const questions = await Question.find({ category });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const { category, categoryLabel, question, questionHi, answer, answerHi, tags } = req.body;
    const newQuestion = new Question({
      category,
      categoryLabel,
      question,
      questionHi,
      answer,
      answerHi,
      tags
    });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Question.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchQuestions = async (req, res) => {
  try {
    const { q, category } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (q) {
      filter.$or = [
        { question: { $regex: q, $options: 'i' } },
        { questionHi: { $regex: q, $options: 'i' } },
        { answer: { $regex: q, $options: 'i' } }
      ];
    }
    const results = await Question.find(filter);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
