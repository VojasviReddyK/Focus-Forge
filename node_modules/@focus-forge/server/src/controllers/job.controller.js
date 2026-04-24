import multer from 'multer';
import { JobApplication } from '../models/JobApplication.js';
import { recordActivity, removeActivity } from '../services/gamification.service.js';
import { uploadBuffer } from '../services/cloudinary.service.js';

export const resumeUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => cb(null, file.mimetype === 'application/pdf'),
  limits: { fileSize: 5 * 1024 * 1024 }
});

export async function listJobs(req, res) {
  const jobs = await JobApplication.find({ userId: req.userId }).sort({ date: -1 });
  res.json({ jobs });
}

export async function createJob(req, res) {
  const payload = { ...req.body, userId: req.userId };
  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer);
    payload.resumeUrl = uploaded.secure_url;
    payload.resumePublicId = uploaded.public_id;
  }
  const job = await JobApplication.create(payload);
  await recordActivity({ userId: req.userId, actionType: 'JOB_APPLICATION', referenceId: job._id.toString() });
  res.status(201).json({ job });
}

export async function updateJob(req, res) {
  const payload = { ...req.body };
  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer);
    payload.resumeUrl = uploaded.secure_url;
    payload.resumePublicId = uploaded.public_id;
  }
  const job = await JobApplication.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, payload, { new: true });
  if (!job) return res.status(404).json({ message: 'Job application not found' });
  res.json({ job });
}

export async function deleteJob(req, res) {
  const job = await JobApplication.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!job) return res.status(404).json({ message: 'Job application not found' });
  await removeActivity({ userId: req.userId, actionType: 'JOB_APPLICATION', referenceId: job._id.toString() });
  res.json({ deleted: true });
}
