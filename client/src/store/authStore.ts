import { create } from 'zustand';
import { api } from '../services/api';

type User = { id: string; name: string; email: string; points: number; level: number; streak: number; badges: string[] };

type AuthState = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('focus_forge_access'),
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('focus_forge_access', data.accessToken);
    localStorage.setItem('focus_forge_refresh', data.refreshToken);
    set({ user: data.user, accessToken: data.accessToken });
  },
  async register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('focus_forge_access', data.accessToken);
    localStorage.setItem('focus_forge_refresh', data.refreshToken);
    set({ user: data.user, accessToken: data.accessToken });
  },
  logout() {
    localStorage.removeItem('focus_forge_access');
    localStorage.removeItem('focus_forge_refresh');
    set({ user: null, accessToken: null });
  }
}));
