import { ReactNode } from 'react';
import { BarChart3, Briefcase, CalendarDays, CheckSquare, Code2, Home, Linkedin, LogOut, Network } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'dsa', label: 'DSA', icon: Code2 },
  { id: 'system', label: 'System Design', icon: Network },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
];

export function AppLayout({ page, setPage, children }: { page: string; setPage: (page: string) => void; children: ReactNode }) {
  const logout = useAuthStore((state) => state.logout);
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe_0,#f8fbff_35%,#ffffff_100%)]">
      <aside className="fixed inset-y-4 left-4 hidden w-64 rounded-xl border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur-xl lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white"><CheckSquare /></div>
          <div>
            <h1 className="text-lg font-bold text-slate-950">Focus Forge</h1>
            <p className="text-xs text-slate-500">Progress, not noise</p>
          </div>
        </div>
        <nav className="space-y-2">
          {nav.map((item) => (
            <button key={item.id} onClick={() => setPage(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${page === item.id ? 'bg-blue-50 text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-sm text-slate-600">
          <LogOut size={16} /> Sign out
        </button>
      </aside>
      <main className="px-4 py-5 lg:ml-72 lg:px-8">{children}</main>
    </div>
  );
}
