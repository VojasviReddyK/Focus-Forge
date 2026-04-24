import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuthStore();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      if (mode === 'login') await login(email, password);
      else await register(name, email, password);
    } catch {
      setError('Could not authenticate. Check your details and try again.');
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#dbeafe,#ffffff_55%)] p-4">
      <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="glass w-full max-w-md rounded-xl p-8">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-white"><Flame /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Focus Forge</h1>
            <p className="text-sm text-slate-500">Gamified job-prep OS</p>
          </div>
        </div>
        {mode === 'register' && <input className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />}
        <input className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-xl bg-primary py-3 font-semibold text-white shadow-soft">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-4 w-full text-sm text-primary">
          {mode === 'login' ? 'Create a new account' : 'Use an existing account'}
        </button>
      </motion.form>
    </main>
  );
}
