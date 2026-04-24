import { CheckCircle2 } from 'lucide-react';
import { Card } from '../components/Card';
import { api } from '../services/api';

export function MernTracker() {
  return (
    <Card>
      <button onClick={() => api.post('/activity/mern-today')} className="flex w-full items-center gap-4 rounded-xl bg-green-50 p-4 text-left text-green-800">
        <CheckCircle2 /> Completed MERN Learning Today
      </button>
    </Card>
  );
}
