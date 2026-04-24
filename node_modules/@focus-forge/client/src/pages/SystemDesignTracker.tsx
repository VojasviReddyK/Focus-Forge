import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { api } from '../services/api';

const fallback = [
  'Web fundamentals: HTTP, HTTPS, request/response, headers', 'APIs: REST, GraphQL, gRPC', 'Realtime systems: WebSockets, SSE, polling',
  'Security: XSS, CSRF, CSP, secure headers', 'Performance: caching, rendering, optimization', 'Storage: cookies, IndexedDB, localStorage',
  'Architecture: component design, state, routing', 'UI patterns: infinite scroll, chat UI, optimistic updates', 'Social Media Feed',
  'E-commerce', 'Video Streaming', 'Chat Systems', 'Testing: unit, integration, E2E, TDD', 'Accessibility', 'PWA', 'Monitoring', 'Interview prep and salary negotiation'
].map((title, i) => ({ id: title.toLowerCase().replace(/\W+/g, '-'), title, level: i < 5 ? 'Beginner' : i < 11 ? 'Intermediate' : 'Advanced' }));

export function SystemDesignTracker() {
  const [topics, setTopics] = useState(fallback);
  const [done, setDone] = useState<Set<string>>(new Set());
  useEffect(() => { api.get('/system-design').then((res) => { setTopics(res.data.topics); setDone(new Set(res.data.completedTopicIds)); }).catch(() => undefined); }, []);
  const percent = Math.round((done.size / topics.length) * 100);
  async function toggle(id: string) {
    const next = new Set(done);
    const completed = !next.has(id);
    completed ? next.add(id) : next.delete(id);
    setDone(next);
    await api.patch('/system-design/progress', { topicId: id, completed }).catch(() => setDone(done));
  }
  return <div className="space-y-5"><h2 className="text-3xl font-bold">System Design Checklist</h2><Card><div className="mb-2 flex justify-between"><span>{done.size}/{topics.length}</span><span>{percent}%</span></div><ProgressBar value={percent} /></Card>{['Beginner', 'Intermediate', 'Advanced'].map((level) => <Card key={level}><h3 className="mb-3 font-semibold text-primary">{level}</h3><div className="grid gap-2 md:grid-cols-2">{topics.filter((t) => t.level === level).map((topic) => <label key={topic.id} className="rounded-xl bg-slate-50 p-3"><input className="mr-3" type="checkbox" checked={done.has(topic.id)} onChange={() => toggle(topic.id)} />{topic.title}</label>)}</div></Card>)}</div>;
}
