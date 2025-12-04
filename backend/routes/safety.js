const express = require('express');
const { getSafetyResources, logEmergency, updateLiveLocation } = require('../controllers/safetyController');

const router = express.Router();

router.get('/', getSafetyResources);
router.post('/emergency', logEmergency);
router.post('/live-track/:userId', updateLiveLocation);

module.exports = router;
