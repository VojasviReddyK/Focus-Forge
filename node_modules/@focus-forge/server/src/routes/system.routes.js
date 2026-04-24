import { Router } from 'express';
import { getSystemDesign, toggleSystemTopic } from '../controllers/system.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', getSystemDesign);
router.patch('/progress', toggleSystemTopic);
export default router;
