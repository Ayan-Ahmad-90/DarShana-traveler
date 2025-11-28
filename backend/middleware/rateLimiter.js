const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs for auth
  message: { message: 'Too many login/signup attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 booking requests per hour
  message: { message: 'Too many booking requests from this IP, please try again after an hour' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, bookingLimiter };
