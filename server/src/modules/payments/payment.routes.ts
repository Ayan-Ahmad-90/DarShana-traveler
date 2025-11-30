import { Router } from 'express';
import { authenticate, requireRoles } from '../../middlewares/authMiddleware.js';
import {
  initiatePayment,
  stripeWebhook,
  razorpayWebhook,
  requestRefundHandler,
  getMyPayments
} from './payment.controller.js';

const router = Router();

router.post('/checkout', authenticate, initiatePayment);
router.post('/webhooks/stripe', stripeWebhook);
router.post('/webhooks/razorpay', razorpayWebhook);
router.post('/refunds', authenticate, requireRoles('SuperAdmin', 'Finance'), requestRefundHandler);
router.get('/history', authenticate, getMyPayments);

export default router;
