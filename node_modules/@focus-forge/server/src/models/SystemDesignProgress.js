import mongoose from 'mongoose';

const systemDesignProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topicId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: Date
  },
  { timestamps: true }
);

systemDesignProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });
export const SystemDesignProgress = mongoose.model('SystemDesignProgress', systemDesignProgressSchema);
