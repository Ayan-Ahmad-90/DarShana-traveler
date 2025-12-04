import { Router } from 'express';
import { listBlogs, getBlogById } from '../controllers/blogController.js';

const router = Router();

router.get('/', listBlogs);
router.get('/:id', getBlogById);

export default router;
