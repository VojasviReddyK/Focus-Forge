import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    notes: String,
    date: { type: Date, required: true },
    isDeadline: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);
