import express from 'express';
import { GuideController } from '../controllers/guideController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/register', authMiddleware, GuideController.registerGuide);
router.get('/my-profile', authMiddleware, GuideController.getGuideProfile);
router.put('/my-profile', authMiddleware, GuideController.updateGuideProfile);
router.get('/by-location', authMiddleware, GuideController.getGuidesByLocation);
router.get('/:guideId', authMiddleware, GuideController.getSingleGuide);
router.post('/:guideId/interact', authMiddleware, GuideController.interactWithGuide);
router.get('/:guideId/interactions', authMiddleware, GuideController.getGuideInteractions);
router.get('/my-interactions', authMiddleware, GuideController.getMyInteractions);

export default router;
