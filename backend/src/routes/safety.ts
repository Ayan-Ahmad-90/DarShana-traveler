import { Router } from 'express';
import { getSafetyResources, logEmergency, updateLiveLocation } from '../controllers/safetyController.js';

const router = Router();

router.get('/', getSafetyResources);
router.post('/emergency', logEmergency);
router.post('/live-track/:userId', updateLiveLocation);

export default router;
