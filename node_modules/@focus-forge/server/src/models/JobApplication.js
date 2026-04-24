import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Applied', 'Interview', 'Rejected', 'Offer'], default: 'Applied' },
    resumeUrl: String,
    resumePublicId: String,
    notes: String,
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
