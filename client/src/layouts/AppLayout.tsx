import { ReactNode, useState } from 'react';
import { BarChart3, Briefcase, CalendarDays, CheckSquare, Code2, Home, Linkedin, LogOut, Menu, Network, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setPage(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe_0,#f8fbff_35%,#ffffff_100%)]">
      {/* Desktop Sidebar */}
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

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 border-b border-white/70 bg-white/85 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white"><CheckSquare size={20} /></div>
            <h1 className="text-lg font-bold text-slate-950">Focus Forge</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg p-2 hover:bg-slate-100">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav className="border-t border-white/70 bg-white/95 p-4 space-y-2">
            {nav.map((item) => (
              <button key={item.id} onClick={() => handleNavClick(item.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${page === item.id ? 'bg-blue-50 text-primary shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                <item.icon size={18} /> {item.label}
              </button>
            ))}
            <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 mt-4 py-2.5 text-sm text-slate-600">
              <LogOut size={16} /> Sign out
            </button>
          </nav>
        )}
      </div>

      <main className="px-4 py-5 sm:px-6 lg:ml-72 lg:px-8 lg:py-5">{children}</main>
    </div>
  );
}
