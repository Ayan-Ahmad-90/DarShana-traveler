const express = require('express');
const questionController = require('../controllers/questionController');

const router = express.Router();

router.get('/', questionController.getAllQuestions);
router.get('/category/:category', questionController.getQuestionsByCategory);
router.get('/search', questionController.searchQuestions);
router.get('/:id', questionController.getQuestionById);
router.post('/', questionController.createQuestion);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;
