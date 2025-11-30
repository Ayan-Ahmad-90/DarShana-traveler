const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret',
});

exports.createOrder = async (amount, currency = 'INR') => {
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

exports.verifyPayment = (orderId, paymentId, signature) => {
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret')
    .update(orderId + '|' + paymentId)
    .digest('hex');

  return generated_signature === signature;
};
