import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret',
});

export const createOrder = async (amount, currency = 'INR') => {
  const options = {
    amount: amount * 100, // amount in smallest currency unit
    currency,
    receipt: 'receipt_' + Date.now(),
  };
  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay Error:', error);
    throw error;
  }
};

export const verifyPayment = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret')
    .update(orderId + '|' + paymentId)
    .digest('hex');

  return generated_signature === signature;
};
