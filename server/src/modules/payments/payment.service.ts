import Razorpay from 'razorpay';
import Stripe from 'stripe';
import Booking from '../../models/Booking.js';
import Payment from '../../models/Payment.js';
import Refund from '../../models/Refund.js';
import TaxConfig from '../../models/TaxConfig.js';
import Coupon from '../../models/Coupon.js';
import WalletTransaction from '../../models/WalletTransaction.js';
import { validateCoupon } from '../../utils/couponValidator.js';
import { calculateFareBreakdown } from '../../utils/fareCalculator.js';
import { environment } from '../../config/environment.js';
import { razorpayClient, stripeClient } from '../../config/paymentGateways.js';

interface PaymentPayload {
  bookingId: string;
  method: 'razorpay' | 'stripe' | 'wallet' | 'cod';
  couponCode?: string;
  walletAmount?: number;
}

export const createPaymentOrder = async ({ bookingId, method, couponCode, walletAmount = 0 }: PaymentPayload) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');

  const taxConfig = await TaxConfig.findOne({ isActive: true }).sort({ effectiveFrom: -1 });
  let couponDiscount = 0;
  if (couponCode) {
    const { isValid, discountAmount, reason } = await validateCoupon(couponCode, booking.amountBreakdown.total);
    if (!isValid) throw new Error(reason || 'Coupon invalid');
    couponDiscount = discountAmount;
    booking.coupon = { code: couponCode, discountAmount };
  }

  const breakdown = calculateFareBreakdown({
    baseFare: booking.amountBreakdown.baseFare,
    couponDiscount,
    walletAmount,
    currency: booking.amountBreakdown.currency,
    taxConfig
  });
  booking.amountBreakdown = breakdown;
  booking.walletUsed = walletAmount;
  await booking.save();

  const payment = await Payment.create({
    booking: booking._id,
    user: booking.user,
    method,
    provider: method === 'razorpay' ? 'Razorpay' : method === 'stripe' ? 'Stripe' : method === 'wallet' ? 'Wallet' : 'COD',
    amount: breakdown.payableAmount ?? breakdown.total,
    currency: breakdown.currency,
    status: method === 'wallet' ? 'paid' : 'pending',
    breakdown: {
      base: breakdown.baseFare,
      tax: breakdown.taxes,
      fee: breakdown.fees,
      discount: breakdown.discounts,
      wallet: breakdown.walletAmount || 0
    }
  });

  let gatewayPayload: Record<string, unknown> | undefined;

  if (method === 'razorpay' && razorpayClient) {
    const order = await razorpayClient.orders.create({
      amount: Math.round(payment.amount * 100),
      currency: payment.currency,
      receipt: booking.bookingCode,
      notes: { bookingId: booking._id.toString() }
    });
    payment.providerOrderId = order.id;
    await payment.save();
    gatewayPayload = order;
  }

  if (method === 'stripe' && stripeClient) {
    const intent = await stripeClient.paymentIntents.create({
      amount: Math.round(payment.amount * 100),
      currency: payment.currency.toLowerCase(),
      metadata: { bookingId: booking._id.toString() }
    });
    payment.providerOrderId = intent.id;
    await payment.save();
    gatewayPayload = intent;
  }

  if (method === 'wallet') {
    await WalletTransaction.create({
      user: booking.user,
      booking: booking._id,
      type: 'debit',
      amount: payment.amount,
      currency: payment.currency,
      balanceAfter: Math.max(0, (booking.walletUsed || 0) - payment.amount),
      reason: 'Booking payment via wallet'
    });
  }

  return { payment, booking, gatewayPayload };
};

export const markPaymentSuccess = async (
  paymentId: string,
  providerPaymentId?: string,
  metadata?: Record<string, unknown>
) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) return;
  payment.status = 'paid';
  payment.providerPaymentId = providerPaymentId || payment.providerPaymentId;
  payment.metadata = { ...payment.metadata, ...metadata };
  await payment.save();
  await Booking.findByIdAndUpdate(payment.booking, {
    status: 'confirmed',
    paymentStatus: 'paid'
  });
};

export const handleStripeWebhook = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent;
      const payment = await Payment.findOne({ providerOrderId: intent.id });
      if (payment) {
        await markPaymentSuccess(payment._id.toString(), intent.latest_charge ?? undefined, {
          stripeEventId: event.id
        });
      }
      break;
    }
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const payment = await Payment.findOne({ providerPaymentId: charge.id });
      if (payment) {
        payment.status = 'refunded';
        payment.refundedAmount = (charge.amount_refunded || 0) / 100;
        await payment.save();
        await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: 'refunded' });
      }
      break;
    }
    default:
      break;
  }
};

export const handleRazorpayWebhook = async (payload: Razorpay.WebhookEvent) => {
  if (payload.event === 'payment.captured') {
    const paymentId = payload.payload.payment.entity.id;
    const payment = await Payment.findOne({ providerPaymentId: paymentId });
    if (payment) {
      await markPaymentSuccess(payment._id.toString(), paymentId, { razorpayEventId: payload.id });
    }
  }
  if (payload.event === 'refund.processed') {
    const refund = payload.payload.refund.entity;
    await Payment.findOneAndUpdate(
      { providerPaymentId: refund.payment_id },
      { status: 'refunded', refundedAmount: refund.amount / 100 }
    );
  }
};

export const createRefund = async ({
  bookingId,
  paymentId,
  amount,
  reason,
  actorId
}: {
  bookingId: string;
  paymentId: string;
  amount: number;
  reason?: string;
  actorId: string;
}) => {
  const refund = await Refund.create({
    booking: bookingId,
    payment: paymentId,
    user: actorId,
    amountRequested: amount,
    status: 'approved',
    reason,
    timeline: [{ status: 'approved', note: reason, timestamp: new Date(), actor: actorId }]
  });
  await Payment.findByIdAndUpdate(paymentId, {
    status: amount ? 'partially_refunded' : 'refunded',
    refundedAmount: amount
  });
  await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'refunded', status: 'refunded' });
  return refund;
};

export const getPaymentHistory = async (userId: string) => {
  return Payment.find({ user: userId }).sort({ createdAt: -1 }).limit(50);
};
