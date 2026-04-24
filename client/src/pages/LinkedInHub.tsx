import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { api } from '../services/api';

export function LinkedInHub() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('Journey, DSA');
  const load = () => api.get('/posts').then((res) => setPosts(res.data.posts)).catch(() => undefined);
  useEffect(() => { void load(); }, []);
  async function save(status: 'draft' | 'posted') {
    await api.post('/posts', { content, tags: tags.split(',').map((t) => t.trim()).filter(Boolean), status });
    setContent('');
    load();
  }
  return (
    <div className="space-y-5">
      <h2 className="text-3xl font-bold">LinkedIn Content Hub</h2>
      <Card>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-40 w-full rounded-xl border border-slate-200 p-4" placeholder="Draft your post..." />
        <input value={tags} onChange={(e) => setTags(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-200 p-3" placeholder="AI, DSA, Journey" />
        <div className="mt-3 flex gap-3"><button onClick={() => save('draft')} className="rounded-xl border px-4 py-2">Save draft</button><button onClick={() => save('posted')} className="rounded-xl bg-primary px-4 py-2 text-white">Mark posted</button></div>
      </Card>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">{posts.map((post) => <Card key={post._id}><p className="whitespace-pre-wrap text-sm">{post.content}</p><div className="mt-3 flex flex-wrap gap-2">{post.tags.map((tag: string) => <span className="rounded-full bg-purple-50 px-2 py-1 text-xs text-purple-700" key={tag}>{tag}</span>)}</div><p className="mt-3 text-xs uppercase text-slate-500">{post.status}</p></Card>)}</div>
    </div>
  );
}
