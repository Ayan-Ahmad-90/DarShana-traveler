const express = require('express');
const Razorpay = require('razorpay');

const router = express.Router();

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = keyId && keySecret ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : null;

router.post('/razorpay/order', async (req, res) => {
  const { amount, currency = 'INR' } = req.body || {};

  if (!amount || Number.isNaN(Number(amount))) {
    return res.status(400).json({ message: 'Valid amount is required' });
  }

  if (!razorpay) {
    return res.status(503).json({ message: 'Razorpay keys missing on server' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: `mood-${Date.now()}`,
      notes: { product: 'AiMood Analyzer' },
    });

    res.json({ order });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
  }
});

module.exports = router;
