import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/authMiddleware.js';
import { getWalletSummary, adjustWallet } from './wallet.service.js';

export const getWallet = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const summary = await getWalletSummary(req.user.id);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

export const adjustUserWallet = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const transaction = await adjustWallet({
      userId: req.body.userId,
      amount: req.body.amount,
      type: req.body.type,
      reason: req.body.reason,
      bookingId: req.body.bookingId,
      actorId: req.user?.id
    });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};
