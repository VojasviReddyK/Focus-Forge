import { SystemDesignProgress } from '../models/SystemDesignProgress.js';
import { systemDesignTopics } from '../data/systemDesignTopics.js';
import { recordActivity, removeActivity } from '../services/gamification.service.js';

export async function getSystemDesign(req, res) {
  const completedDocs = await SystemDesignProgress.find({ userId: req.userId, completed: true }).lean();
  const completed = new Set(completedDocs.map((item) => item.topicId));
  res.json({
    topics: systemDesignTopics,
    completedTopicIds: [...completed],
    stats: {
      total: systemDesignTopics.length,
      completed: completed.size,
      percent: Math.round((completed.size / systemDesignTopics.length) * 100)
    }
  });
}

export async function toggleSystemTopic(req, res) {
  const { topicId, completed } = req.body;
  if (!systemDesignTopics.some((topic) => topic.id === topicId)) return res.status(404).json({ message: 'Topic not found' });
  const progress = await SystemDesignProgress.findOneAndUpdate(
    { userId: req.userId, topicId },
    { completed, completedAt: completed ? new Date() : null },
    { upsert: true, new: true }
  );
  if (completed) await recordActivity({ userId: req.userId, actionType: 'SYSTEM_TOPIC', referenceId: topicId });
  else await removeActivity({ userId: req.userId, actionType: 'SYSTEM_TOPIC', referenceId: topicId });
  res.json({ progress });
}
