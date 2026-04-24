import { Router } from 'express';
import { weeklyAnalytics } from '../controllers/analytics.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/weekly', weeklyAnalytics);
export default router;
