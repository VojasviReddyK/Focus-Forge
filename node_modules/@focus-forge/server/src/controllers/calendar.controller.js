import { CalendarEvent } from '../models/CalendarEvent.js';
import { recordActivity } from '../services/gamification.service.js';

export async function listEvents(req, res) {
  const events = await CalendarEvent.find({ userId: req.userId }).sort({ date: 1 });
  res.json({ events });
}

export async function createEvent(req, res) {
  const event = await CalendarEvent.create({ ...req.body, userId: req.userId });
  await recordActivity({ userId: req.userId, actionType: 'CALENDAR_NOTE', referenceId: event._id.toString() });
  res.status(201).json({ event });
}
