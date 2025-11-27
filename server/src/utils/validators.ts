import Joi from 'joi';

export const flightSearchSchema = Joi.object({
  from: Joi.string().required().messages({
    'string.empty': 'Origin city is required',
  }),
  to: Joi.string().required().messages({
    'string.empty': 'Destination city is required',
  }),
  date: Joi.date().iso().required().messages({
    'date.base': 'Valid date is required',
  }),
  passengers: Joi.number().integer().min(1).max(9).default(1),
  class: Joi.string().valid('economy', 'premium_economy', 'business', 'first').default('economy'),
});

export const trainSearchSchema = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  date: Joi.date().iso().required(),
  passengers: Joi.number().integer().min(1).max(9).default(1),
  class: Joi.string().valid('ac1', 'ac2', 'ac3', 'sleeper', 'general').default('ac2'),
});

export const bookingSchema = Joi.object({
  bookingType: Joi.string().valid('flight', 'train', 'cruise', 'private_jet', 'cab', 'bike').required(),
  itemId: Joi.string().required(),
  passengers: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      dateOfBirth: Joi.date().iso(),
      documentId: Joi.string(),
    })
  ).required(),
  totalPrice: Joi.number().required(),
  specialRequests: Joi.string().optional(),
  insuranceIncluded: Joi.boolean().default(false),
});

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
