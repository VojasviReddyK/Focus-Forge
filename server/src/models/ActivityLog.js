import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    actionType: {
      type: String,
      enum: ['DSA_PROBLEM', 'SYSTEM_TOPIC', 'JOB_APPLICATION', 'LINKEDIN_POST', 'MERN_DAILY', 'CALENDAR_NOTE'],
      required: true
    },
    points: { type: Number, default: 0 },
    referenceId: String,
    date: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
