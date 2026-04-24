import { ActivityLog } from '../models/ActivityLog.js';
import { JobApplication } from '../models/JobApplication.js';

export async function weeklyAnalytics(req, res) {
  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  const [logs, jobs] = await Promise.all([
    ActivityLog.find({ userId: req.userId, date: { $gte: start } }).lean(),
    JobApplication.find({ userId: req.userId, date: { $gte: start } }).lean()
  ]);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return {
      day: key,
      points: logs.filter((log) => log.date.toISOString().slice(0, 10) === key).reduce((sum, log) => sum + log.points, 0),
      dsa: logs.filter((log) => log.actionType === 'DSA_PROBLEM' && log.date.toISOString().slice(0, 10) === key).length,
      applications: jobs.filter((job) => job.date.toISOString().slice(0, 10) === key).length
    };
  });
  res.json({ days });
}
