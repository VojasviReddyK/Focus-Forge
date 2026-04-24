import { DSAProgress } from '../models/DSAProgress.js';
import dsaSheet from '../data/dsaSheet.json' with { type: 'json' };
import { recordActivity, removeActivity } from '../services/gamification.service.js';

const flatProblems = dsaSheet.modules.flatMap((module) =>
  module.topics.flatMap((topic) => topic.problems.map((problem) => ({ ...problem, moduleId: module.id, topicId: topic.id })))
);

export async function getDsaSheet(req, res) {
  const progress = await DSAProgress.find({ userId: req.userId, completed: true }).lean();
  const completed = new Set(progress.map((item) => item.problemId));
  const solved = completed.size;
  res.json({
    source: dsaSheet.source,
    modules: dsaSheet.modules,
    stats: { total: flatProblems.length, solved, percent: Math.round((solved / flatProblems.length) * 100) },
    completedProblemIds: [...completed]
  });
}

export async function toggleDsaProblem(req, res) {
  const { problemId, completed } = req.body;
  const problem = flatProblems.find((item) => String(item.id) === String(problemId));
  if (!problem) return res.status(404).json({ message: 'Problem not found in sheet' });
  const progress = await DSAProgress.findOneAndUpdate(
    { userId: req.userId, problemId },
    { completed, completedAt: completed ? new Date() : null },
    { upsert: true, new: true }
  );
  if (completed) await recordActivity({ userId: req.userId, actionType: 'DSA_PROBLEM', referenceId: problemId });
  else await removeActivity({ userId: req.userId, actionType: 'DSA_PROBLEM', referenceId: problemId });
  res.json({ progress });
}
