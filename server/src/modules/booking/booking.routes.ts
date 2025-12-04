import { Router } from 'express';
import { authenticate, requireRoles } from '../../middlewares/authMiddleware.js';
import {
  createBookingHandler,
  listBookingsHandler,
  updateBookingStatusHandler,
  assignGuideHandler
} from './booking.controller.js';

const router = Router();

router.get('/', authenticate, requireRoles('SuperAdmin', 'Manager', 'Support'), listBookingsHandler);
router.post('/', authenticate, createBookingHandler);
router.patch('/:id/status', authenticate, requireRoles('SuperAdmin', 'Manager', 'Support'), updateBookingStatusHandler);
router.patch('/:id/assign-guide', authenticate, requireRoles('SuperAdmin', 'Manager'), assignGuideHandler);

export default router;
