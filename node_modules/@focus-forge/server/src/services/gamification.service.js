import { ActivityLog } from '../models/ActivityLog.js';
import { User } from '../models/User.js';

export const POINTS = {
  DSA_PROBLEM: 10,
  SYSTEM_TOPIC: 20,
  JOB_APPLICATION: 5,
  LINKEDIN_POST: 30,
  MERN_DAILY: 10,
  CALENDAR_NOTE: 0
};

function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function calculateLevel(points) {
  return Math.min(10, Math.max(1, Math.floor(points / 250) + 1));
}

async function calculateStreak(userId) {
  const logs = await ActivityLog.find({ userId }).select('date').sort({ date: -1 }).lean();
  const days = [...new Set(logs.map((log) => dayKey(log.date)))];
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = dayKey(cursor);
    if (!days.includes(key)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

function badgesFor(user) {
  const badges = new Set(user.badges || []);
  if (user.streak >= 7) badges.add('Consistency Badge');
  if (user.level >= 3) badges.add('Focus Mode Unlocked');
  if (user.points >= 2500) badges.add('Top 1% Grinder');
  return [...badges];
}

export async function recordActivity({ userId, actionType, referenceId, points = POINTS[actionType] ?? 0 }) {
  const exists = await ActivityLog.findOne({ userId, actionType, referenceId });
  if (exists) return exists;
  const log = await ActivityLog.create({ userId, actionType, referenceId, points });
  const user = await User.findById(userId);
  user.points += points;
  user.level = calculateLevel(user.points);
  user.streak = await calculateStreak(userId);
  user.badges = badgesFor(user);
  await user.save();
  return log;
}

export async function removeActivity({ userId, actionType, referenceId }) {
  const log = await ActivityLog.findOneAndDelete({ userId, actionType, referenceId });
  if (!log) return;
  const user = await User.findById(userId);
  user.points = Math.max(0, user.points - log.points);
  user.level = calculateLevel(user.points);
  user.streak = await calculateStreak(userId);
  user.badges = badgesFor(user);
  await user.save();
}

export async function dailySummary(userId) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const logs = await ActivityLog.find({ userId, date: { $gte: start } }).lean();
  return {
    completedActions: logs.length,
    pointsToday: logs.reduce((sum, log) => sum + log.points, 0)
  };
}
