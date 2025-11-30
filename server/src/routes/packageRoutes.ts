import { Router } from 'express';
import Joi from 'joi';
import { listPackages, getPackageById, createPackage } from '../controllers/packageController.js';
import { validateBody } from '../middlewares/requestValidator.js';

const router = Router();

const packageSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  duration: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  inclusions: Joi.array().items(Joi.string()).default([]),
  exclusions: Joi.array().items(Joi.string()).default([]),
  itinerary: Joi.array().items(Joi.string()).default([]),
  heroImage: Joi.string().uri().required(),
  tags: Joi.array().items(Joi.string()).default([])
});

router.get('/', listPackages);
router.get('/:id', getPackageById);
router.post('/', validateBody(packageSchema), createPackage);

export default router;
