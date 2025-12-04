import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import {
  createPaymentOrder,
  handleStripeWebhook,
  handleRazorpayWebhook,
  createRefund,
  getPaymentHistory
} from './payment.service.js';

export const initiatePayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const payload = {
      bookingId: req.body.bookingId,
      method: req.body.method,
      couponCode: req.body.couponCode,
      walletAmount: req.body.walletAmount
    } as const;
    const result = await createPaymentOrder(payload);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const stripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await handleStripeWebhook(req.body);
    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

export const razorpayWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await handleRazorpayWebhook(req.body);
    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

export const requestRefundHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const refund = await createRefund({
      bookingId: req.body.bookingId,
      paymentId: req.body.paymentId,
      amount: req.body.amount,
      reason: req.body.reason,
      actorId: req.user.id
    });
    res.status(201).json(refund);
  } catch (error) {
    next(error);
  }
};

export const getMyPayments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const payments = await getPaymentHistory(req.user.id);
    res.json(payments);
  } catch (error) {
    next(error);
  }
};
