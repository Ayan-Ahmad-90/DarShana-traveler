import { Router } from 'express';
import { authenticate, requireRoles } from '../../middlewares/authMiddleware.js';
import {
  createSupportHandler,
  replySupportHandler,
  listSupportHandler,
  updateSupportStatusHandler
} from './support.controller.js';

const router = Router();

router.get('/', authenticate, listSupportHandler);
router.post('/', authenticate, createSupportHandler);
router.post('/:id/reply', authenticate, replySupportHandler);
router.patch('/:id/status', authenticate, requireRoles('Support', 'SuperAdmin'), updateSupportStatusHandler);

export default router;
