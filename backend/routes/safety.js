const express = require('express');
const router = express.Router();
const safetyController = require('../controllers/safetyController');

router.get('/', safetyController.getSafetyResources);

module.exports = router;
