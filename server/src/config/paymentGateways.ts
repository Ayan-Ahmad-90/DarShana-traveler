import Razorpay from 'razorpay';
import Stripe from 'stripe';
import { environment } from './environment.js';

export const stripeClient = environment.stripe.secretKey
  ? new Stripe(environment.stripe.secretKey, { apiVersion: '2023-08-16' })
  : null;

export const razorpayClient =
  environment.razorpay.keyId && environment.razorpay.keySecret
    ? new Razorpay({ key_id: environment.razorpay.keyId, key_secret: environment.razorpay.keySecret })
    : null;
