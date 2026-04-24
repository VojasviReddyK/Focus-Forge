import { Router } from 'express';
import { createJob, deleteJob, listJobs, resumeUpload, updateJob } from '../controllers/job.controller.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', listJobs);
router.post('/', resumeUpload.single('resume'), createJob);
router.put('/:id', resumeUpload.single('resume'), updateJob);
router.delete('/:id', deleteJob);
export default router;
