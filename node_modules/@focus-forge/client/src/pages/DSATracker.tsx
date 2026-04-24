import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { api } from '../services/api';
import localSheetJson from '../data/dsaSheet.json';

type DsaProblem = { id: string; name: string; slug: string; difficulty?: string; type?: string; rank?: number; resources?: Record<string, string> };
type DsaTopic = { id: string; name: string; slug?: string; rank?: number; problems: DsaProblem[] };
type DsaModule = { id: string; name: string; slug?: string; rank?: number; topics: DsaTopic[] };
const localSheet = localSheetJson as { source: { officialProblemCount: number }; modules: DsaModule[] };

export function DSATracker() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [openModule, setOpenModule] = useState(localSheet.modules[0]?.id);
  const [openTopic, setOpenTopic] = useState<string>('');
  useEffect(() => { api.get('/dsa').then((res) => setCompleted(new Set(res.data.completedProblemIds))).catch(() => undefined); }, []);
  const total = localSheet.source.officialProblemCount;
  const percent = Math.round((completed.size / total) * 100);

  async function toggle(id: string) {
    const next = new Set(completed);
    const isDone = !next.has(id);
    isDone ? next.add(id) : next.delete(id);
    setCompleted(next);
    await api.patch('/dsa/progress', { problemId: id, completed: isDone }).catch(() => setCompleted(completed));
  }

  return (
    <div className="space-y-5">
      <header><p className="text-sm font-semibold text-primary">Official TakeUForward source</p><h2 className="text-3xl font-bold">DSA Tracker</h2></header>
      <Card><div className="mb-2 flex justify-between"><span>{completed.size}/{total} solved</span><span>{percent}%</span></div><ProgressBar value={percent} /></Card>
      {localSheet.modules.map((module) => {
        const moduleProblems = module.topics.flatMap((t) => t.problems);
        const moduleSolved = moduleProblems.filter((p) => completed.has(p.id)).length;
        const moduleTotal = moduleProblems.length;
        return (
          <Card key={module.id} className="p-0">
            <button onClick={() => setOpenModule(openModule === module.id ? '' : module.id)} className="flex w-full items-center justify-between p-5 text-left">
              <div><h3 className="font-semibold">{module.name}</h3><p className="text-sm text-slate-500">{moduleSolved}/{moduleTotal}</p></div><ChevronDown />
            </button>
            {openModule === module.id && <div className="border-t border-slate-100 p-4">
              {module.topics.map((topic) => {
                const topicDone = topic.problems.every((p) => completed.has(p.id));
                return (
                  <div key={topic.id} className="mb-3 rounded-xl bg-slate-50">
                    <button onClick={() => setOpenTopic(openTopic === topic.id ? '' : topic.id)} className="flex w-full items-center justify-between px-4 py-3 text-left">
                      <span className={topicDone ? 'font-semibold text-green-700' : 'font-medium'}>{topic.name}</span><span className="text-sm text-slate-500">{topic.problems.filter((p) => completed.has(p.id)).length}/{topic.problems.length}</span>
                    </button>
                    {openTopic === topic.id && <div className="space-y-2 px-4 pb-4">
                      {topic.problems.map((problem) => (
                        <label key={problem.id} className="flex items-center justify-between gap-3 rounded-xl bg-white p-3 text-sm shadow-sm">
                          <span className="flex items-center gap-3"><input type="checkbox" checked={completed.has(problem.id)} onChange={() => toggle(problem.id)} />{problem.name}</span>
                          {problem.resources?.article && <a href={problem.resources.article} target="_blank" className="text-primary"><ExternalLink size={16} /></a>}
                        </label>
                      ))}
                    </div>}
                  </div>
                );
              })}
            </div>}
          </Card>
        );
      })}
    </div>
  );
}
