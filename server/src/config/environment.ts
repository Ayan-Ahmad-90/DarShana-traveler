import dotenv from 'dotenv';

dotenv.config();

const parseList = (value?: string, fallback: string[] = []) => {
  if (!value) return fallback;
  return value.split(',').map((origin) => origin.trim()).filter(Boolean);
};

export const environment = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3001),
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:4173',
  corsOrigins: parseList(process.env.CORS_ORIGIN, ['http://localhost:5173', 'http://localhost:4173']),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/darshana',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  mail: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || 'no-reply@darshana.in'
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || ''
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  },
  payments: {
    defaultCurrency: process.env.DEFAULT_CURRENCY || 'INR'
  }
};
