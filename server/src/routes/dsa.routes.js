import { Router } from 'express';
import { getDsaSheet, toggleDsaProblem } from '../controllers/dsa.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', getDsaSheet);
router.patch('/progress', toggleDsaProblem);
export default router;
