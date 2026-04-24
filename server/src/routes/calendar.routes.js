import { Router } from 'express';
import { createEvent, listEvents } from '../controllers/calendar.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', listEvents);
router.post('/', createEvent);
export default router;
