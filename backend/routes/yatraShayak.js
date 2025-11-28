const express = require('express');
const router = express.Router();
const yatraShayakController = require('../controllers/yatraShayakController');

router.post('/chat', yatraShayakController.chat);

module.exports = router;
