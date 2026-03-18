import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, User } from '@/types';
import { fetchUsers } from '@/data/fetchers';

export const AuthContext = createContext<AuthState & { loading: boolean }>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
});

const STORAGE_KEY = 'hms_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
        setIsAuthenticated(true);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, role: User['role']) => {
    const users = await fetchUsers();
    const match = (users as (User & { password?: string })[]).find(
      (u) => u.email === email && (u as { password?: string }).password === password && u.role === role
    );
    if (!match) throw new Error('Invalid credentials');
    const { password: _pw, ...safeUser } = match as User & { password?: string };
    void _pw;
    setUser(safeUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
