import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { Card } from '../components/Card';
import { api } from '../services/api';

export function CalendarNotes() {
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const load = () => api.get('/calendar').then((res) => setEvents(res.data.events)).catch(() => undefined);
  useEffect(() => { void load(); }, []);
  async function add() { await api.post('/calendar', { title, date, isDeadline: false }); setTitle(''); load(); }
  const key = date.toISOString().slice(0, 10);
  return <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr] grid-cols-1"><Card><Calendar value={date} onChange={(value) => setDate(value as Date)} tileClassName={({ date }) => events.some((e) => e.date.slice(0, 10) === date.toISOString().slice(0, 10)) ? 'bg-blue-50 rounded-xl' : ''} /></Card><Card><h2 className="text-2xl font-bold">Notes</h2><input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-4 w-full rounded-xl border p-3" placeholder="Add note/event" /><button onClick={add} className="mt-3 rounded-xl bg-primary px-4 py-2 text-white">Add</button><div className="mt-5 space-y-2">{events.filter((e) => e.date.slice(0, 10) === key).map((e) => <div className="rounded-xl bg-slate-50 p-3" key={e._id}>{e.title}</div>)}</div></Card></div>;
}
