import { Post } from '../models/Post.js';
import { recordActivity, removeActivity } from '../services/gamification.service.js';

export async function listPosts(req, res) {
  const posts = await Post.find({ userId: req.userId }).sort({ updatedAt: -1 });
  res.json({ posts });
}

export async function createPost(req, res) {
  const post = await Post.create({ ...req.body, userId: req.userId, postedAt: req.body.status === 'posted' ? new Date() : null });
  if (post.status === 'posted') await recordActivity({ userId: req.userId, actionType: 'LINKEDIN_POST', referenceId: post._id.toString() });
  res.status(201).json({ post });
}

export async function updatePost(req, res) {
  const before = await Post.findOne({ _id: req.params.id, userId: req.userId });
  if (!before) return res.status(404).json({ message: 'Post not found' });
  Object.assign(before, req.body);
  if (req.body.status === 'posted' && !before.postedAt) before.postedAt = new Date();
  await before.save();
  if (before.status === 'posted') await recordActivity({ userId: req.userId, actionType: 'LINKEDIN_POST', referenceId: before._id.toString() });
  else await removeActivity({ userId: req.userId, actionType: 'LINKEDIN_POST', referenceId: before._id.toString() });
  res.json({ post: before });
}
