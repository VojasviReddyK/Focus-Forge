import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../components/Card';
import { api } from '../services/api';

export function Analytics() {
  const [days, setDays] = useState<any[]>([]);
  useEffect(() => { api.get('/analytics/weekly').then((res) => setDays(res.data.days)).catch(() => undefined); }, []);
  return <div className="space-y-5"><h2 className="text-3xl font-bold">Weekly Analytics</h2><Card className="h-96"><ResponsiveContainer><BarChart data={days}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="points" fill="#2563eb" /><Bar dataKey="dsa" fill="#16a34a" /><Bar dataKey="applications" fill="#f97316" /></BarChart></ResponsiveContainer></Card></div>;
}
