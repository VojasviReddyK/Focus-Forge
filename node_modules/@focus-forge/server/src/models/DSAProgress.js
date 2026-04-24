import mongoose from 'mongoose';

const dsaProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    problemId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: Date
  },
  { timestamps: true }
);

dsaProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });
export const DSAProgress = mongoose.model('DSAProgress', dsaProgressSchema);
