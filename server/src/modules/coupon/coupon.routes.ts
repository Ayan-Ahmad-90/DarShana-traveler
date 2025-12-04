import { Router } from 'express';
import { authenticate, requireRoles } from '../../middlewares/authMiddleware.js';
import {
  createCouponHandler,
  updateCouponHandler,
  listCouponsHandler,
  toggleCouponHandler
} from './coupon.controller.js';

const router = Router();

router.get('/', authenticate, requireRoles('SuperAdmin', 'Manager'), listCouponsHandler);
router.post('/', authenticate, requireRoles('SuperAdmin', 'Manager'), createCouponHandler);
router.patch('/:id', authenticate, requireRoles('SuperAdmin', 'Manager'), updateCouponHandler);
router.patch('/:id/toggle', authenticate, requireRoles('SuperAdmin', 'Manager'), toggleCouponHandler);

export default router;
