import { useEffect, useState } from 'react';
import { Flame, Gauge, Medal, Sparkles, Target } from 'lucide-react';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { api } from '../services/api';

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get('/activity/dashboard').then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const user = data?.user;
  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div></div>;
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-primary">Today</p>
        <h2 className="text-3xl font-bold text-slate-950">Forge the next checkpoint</h2>
      </header>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Actions', data?.today?.completedActions ?? 0, Target],
          ['Progress', `${data?.overallProgress ?? 0}%`, Gauge],
          ['Points Today', data?.today?.pointsToday ?? 0, Sparkles],
          ['Streak', `${user?.streak ?? 0} days`, Flame],
          ['Level', user?.level ?? 1, Medal]
        ].map(([label, value, Icon]: any) => (
          <Card key={label}><Icon className="mb-4 text-primary" /><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-bold">{value}</p></Card>
        ))}
      </div>
      <Card>
        <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Overall structured progress</h3><span>{data?.overallProgress ?? 0}%</span></div>
        <ProgressBar value={data?.overallProgress ?? 0} />
        <div className="mt-5 flex flex-wrap gap-2">{(user?.badges || []).map((badge: string) => <span key={badge} className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-700">{badge}</span>)}</div>
      </Card>
    </div>
  );
}
