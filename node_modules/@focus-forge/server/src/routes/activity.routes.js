import { Router } from 'express';
import { activityLog, completeMernToday, dashboard } from '../controllers/activity.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/dashboard', dashboard);
router.get('/logs', activityLog);
router.post('/mern-today', completeMernToday);
export default router;
