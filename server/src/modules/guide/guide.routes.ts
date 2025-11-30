import { Router } from 'express';
import { authenticate, requireRoles } from '../../middlewares/authMiddleware.js';
import {
  applyGuideHandler,
  listGuideHandler,
  updateGuideStatusHandler,
  updateGuideAvailabilityHandler
} from './guide.controller.js';

const router = Router();

router.get('/', authenticate, requireRoles('SuperAdmin', 'Manager'), listGuideHandler);
router.post('/apply', authenticate, applyGuideHandler);
router.patch('/:id/status', authenticate, requireRoles('SuperAdmin', 'Manager'), updateGuideStatusHandler);
router.patch('/:id/availability', authenticate, requireRoles('Guide', 'SuperAdmin', 'Manager'), updateGuideAvailabilityHandler);

export default router;
