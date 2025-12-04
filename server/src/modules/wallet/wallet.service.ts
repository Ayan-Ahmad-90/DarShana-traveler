import mongoose from 'mongoose';
import User from '../../models/User.js';
import WalletTransaction from '../../models/WalletTransaction.js';

export const getWalletSummary = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const recent = await WalletTransaction.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
  return { balance: user.walletBalance, currency: user.walletCurrency, transactions: recent };
};

interface WalletAdjustmentPayload {
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  reason: string;
  bookingId?: string;
  actorId?: string;
}

export const adjustWallet = async ({ userId, amount, type, reason, bookingId, actorId }: WalletAdjustmentPayload) => {
  if (amount <= 0) throw new Error('Amount must be positive');
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId).session(session);
    if (!user) throw new Error('User not found');
    const newBalance = type === 'credit' ? user.walletBalance + amount : user.walletBalance - amount;
    if (newBalance < 0) throw new Error('Insufficient balance');
    user.walletBalance = newBalance;
    await user.save({ session });

    const transaction = await WalletTransaction.create([
      {
        user: user._id,
        booking: bookingId,
        type,
        amount,
        currency: user.walletCurrency,
        balanceAfter: newBalance,
        reason,
        actor: actorId
      }
    ], { session });

    await session.commitTransaction();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
