import { ActivityLog } from '../models/ActivityLog.js';
import { User } from '../models/User.js';
import { DSAProgress } from '../models/DSAProgress.js';
import { SystemDesignProgress } from '../models/SystemDesignProgress.js';
import { dailySummary, recordActivity } from '../services/gamification.service.js';
import dsaSheet from '../data/dsaSheet.json' with { type: 'json' };
import { systemDesignTopics } from '../data/systemDesignTopics.js';

const dsaTotal = dsaSheet.modules.reduce((sum, mod) => sum + mod.topics.reduce((topicSum, t) => topicSum + t.problems.length, 0), 0);

export async function dashboard(req, res) {
  const [user, today, dsaSolved, systemSolved] = await Promise.all([
    User.findById(req.userId).lean(),
    dailySummary(req.userId),
    DSAProgress.countDocuments({ userId: req.userId, completed: true }),
    SystemDesignProgress.countDocuments({ userId: req.userId, completed: true })
  ]);
  const overall = Math.round(((dsaSolved + systemSolved) / (dsaTotal + systemDesignTopics.length)) * 100);
  res.json({ user, today, overallProgress: overall, dsaSolved, systemSolved });
}

export async function completeMernToday(req, res) {
  await recordActivity({ userId: req.userId, actionType: 'MERN_DAILY', referenceId: new Date().toISOString().slice(0, 10) });
  res.json({ completed: true });
}

export async function activityLog(req, res) {
  const logs = await ActivityLog.find({ userId: req.userId }).sort({ date: -1 }).limit(100);
  res.json({ logs });
}
