import { useState } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { Analytics } from './pages/Analytics';
import { AuthPage } from './pages/AuthPage';
import { CalendarNotes } from './pages/CalendarNotes';
import { Dashboard } from './pages/Dashboard';
import { DSATracker } from './pages/DSATracker';
import { JobsTracker } from './pages/JobsTracker';
import { LinkedInHub } from './pages/LinkedInHub';
import { SystemDesignTracker } from './pages/SystemDesignTracker';
import { useAuthStore } from './store/authStore';

export default function App() {
  const token = useAuthStore((state) => state.accessToken);
  const [page, setPage] = useState('dashboard');
  if (!token) return <AuthPage />;
  const view = {
    dashboard: <Dashboard />,
    dsa: <DSATracker />,
    system: <SystemDesignTracker />,
    linkedin: <LinkedInHub />,
    jobs: <JobsTracker />,
    calendar: <CalendarNotes />,
    analytics: <Analytics />
  }[page] ?? <Dashboard />;
  return <AppLayout page={page} setPage={setPage}>{view}</AppLayout>;
}
