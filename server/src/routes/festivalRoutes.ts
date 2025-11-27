import { Router } from 'express';
import { FestivalController } from '../controllers/festivalController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Festival routes
router.get('/alerts', authMiddleware, FestivalController.getAlerts);
router.post('/subscribe', authMiddleware, FestivalController.subscribeToFestival);
router.post('/unsubscribe', authMiddleware, FestivalController.unsubscribeFromFestival);
router.put('/preferences', authMiddleware, FestivalController.updateNotificationPreferences);

export default router;
