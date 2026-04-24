import { FormEvent, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { api } from '../services/api';

export function JobsTracker() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [form, setForm] = useState({ company: '', role: '', status: 'Applied', notes: '', date: new Date().toISOString().slice(0, 10) });
  const [resume, setResume] = useState<File | null>(null);
  const load = () => api.get('/jobs').then((res) => setJobs(res.data.jobs)).catch(() => undefined);
  useEffect(() => { void load(); }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, String(value)));
    if (resume) data.append('resume', resume);
    await api.post('/jobs', data);
    setForm({ company: '', role: '', status: 'Applied', notes: '', date: new Date().toISOString().slice(0, 10) });
    setResume(null);
    load();
  }
  async function remove(id: string) { await api.delete(`/jobs/${id}`); load(); }
  return (
    <div className="space-y-5">
      <h2 className="text-3xl font-bold">Job Applications</h2>
      <div className="grid gap-4 md:grid-cols-3"><Card><p className="text-sm text-slate-500">Total</p><p className="text-2xl font-bold">{jobs.length}</p></Card><Card><p className="text-sm text-slate-500">Interviews</p><p className="text-2xl font-bold">{jobs.filter((j) => j.status === 'Interview').length}</p></Card><Card><p className="text-sm text-slate-500">Offers</p><p className="text-2xl font-bold">{jobs.filter((j) => j.status === 'Offer').length}</p></Card></div>
      <Card><form onSubmit={submit} className="grid gap-3 md:grid-cols-2"><input className="rounded-xl border p-3" placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required /><input className="rounded-xl border p-3" placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required /><select className="rounded-xl border p-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{['Applied', 'Interview', 'Rejected', 'Offer'].map((s) => <option key={s}>{s}</option>)}</select><input type="date" className="rounded-xl border p-3" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /><input type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files?.[0] ?? null)} className="rounded-xl border p-3 md:col-span-2" /><textarea className="rounded-xl border p-3 md:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /><button className="rounded-xl bg-primary px-4 py-3 text-white md:col-span-2">Add application</button></form></Card>
      <div className="grid gap-4 md:grid-cols-2">{jobs.map((job) => <Card key={job._id}><div className="flex justify-between"><div><h3 className="font-semibold">{job.company}</h3><p className="text-sm text-slate-500">{job.role}</p></div><button onClick={() => remove(job._id)} className="text-red-500"><Trash2 size={18} /></button></div><span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-sm text-primary">{job.status}</span><p className="mt-3 text-sm">{job.notes}</p>{job.resumeUrl && <a className="mt-3 block text-sm text-primary" href={job.resumeUrl}>Resume PDF</a>}</Card>)}</div>
    </div>
  );
}
