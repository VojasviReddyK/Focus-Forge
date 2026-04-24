import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ['draft', 'posted'], default: 'draft' },
    postedAt: Date
  },
  { timestamps: true }
);

export const Post = mongoose.model('Post', postSchema);
