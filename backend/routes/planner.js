const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');
const auth = require('../middleware/auth');

router.post('/suggestions', auth, plannerController.getSuggestions);
router.post('/mood-analyze', auth, plannerController.analyzeMood);

module.exports = router;
