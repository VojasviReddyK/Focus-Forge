import { Router } from 'express';
import { createPost, listPosts, updatePost } from '../controllers/post.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', listPosts);
router.post('/', createPost);
router.put('/:id', updatePost);
export default router;
