import { Router } from 'express';
import Joi from 'joi';
import { getDestinations, getDestinationById, createDestination, updateDestination } from '../controllers/destinationController.js';
import { validateBody } from '../middlewares/requestValidator.js';

const router = Router();

const destinationSchema = Joi.object({
  name: Joi.string().required(),
  state: Joi.string().required(),
  region: Joi.string().required(),
  shortDescription: Joi.string().required(),
  highlights: Joi.array().items(Joi.string()).default([]),
  bestSeason: Joi.string().required(),
  climate: Joi.string().required(),
  priceRange: Joi.string().required(),
  rating: Joi.number().min(0).max(5).default(4.5),
  heroImage: Joi.string().uri().required(),
  gallery: Joi.array().items(Joi.string().uri()).default([]),
  tags: Joi.array().items(Joi.string()).default([])
});

router.get('/', getDestinations);
router.get('/:id', getDestinationById);
router.post('/', validateBody(destinationSchema), createDestination);
router.put('/:id', validateBody(destinationSchema), updateDestination);

export default router;
