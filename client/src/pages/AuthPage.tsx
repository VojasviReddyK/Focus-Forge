import axios from 'axios';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuthStore();

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    try {
      if (mode === 'login') await login(trimmedEmail, password);
      else await register(trimmedName, trimmedEmail, password);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;
        if (typeof message === 'string' && message.trim()) {
          setError(message);
          return;
        }
      }

      setError('Could not authenticate. Check your details and try again.');
    } finally {
      setIsSubmitting(false);
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
        {mode === 'register' && <input className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />}
        <input className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <input className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button disabled={isSubmitting} className="w-full rounded-xl bg-primary py-3 font-semibold text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} disabled={isSubmitting} className="mt-4 w-full text-sm text-primary disabled:cursor-not-allowed disabled:opacity-70">
          {mode === 'login' ? 'Create a new account' : 'Use an existing account'}
        </button>
      </motion.form>
    </main>
  );
}
