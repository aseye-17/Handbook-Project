import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/types';
import * as API from '@/utils/api';
import { useRouter } from 'expo-router';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const storage = {
    get: (key: string) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
      } catch {}
      return null;
    },
    set: (key: string, value: string) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      } catch {}
    },
    remove: (key: string) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } catch {}
    },
  };

  const TOKEN_KEY = 'auth_token';

  function toFrontendUser(apiUser: any): User {
    // Map backend user { id:number, email, full_name, ... } to frontend User
    return {
      id: String(apiUser.id),
      email: apiUser.email ?? '',
      name: apiUser.full_name ?? '',
      preferences: {
        language: 'en',
        notifications: true,
      },
    };
  }

  // Load token/user on mount
  useEffect(() => {
    const saved = storage.get(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      API.getMe(saved)
        .then((u) => {
          setUser(toFrontendUser(u));
          setIsAuthenticated(true);
        })
        .catch(() => {
          storage.remove(TOKEN_KEY);
          setToken(null);
          setIsAuthenticated(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cross-tab logout sync: if token removed in another tab, reflect here
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === TOKEN_KEY && e.newValue == null) {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        // Optional: navigate to home/login
        try { router.replace('/'); } catch {}
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
      return () => window.removeEventListener('storage', onStorage);
    }
  }, [router]);

  const login = async (email: string, password: string) => {
    const { access_token } = await API.login(email, password);
    storage.set(TOKEN_KEY, access_token);
    setToken(access_token);
    const me = await API.getMe(access_token);
    setUser(toFrontendUser(me));
    setIsAuthenticated(true);
  };

  const loginWithPhone = async (phone: string, otp: string) => {
    // Phone auth ignored per requirements. You could integrate later.
    throw new Error('Phone login is not supported. Please use email/password.');
  };

  const register = async (email: string, password: string, name: string) => {
    await API.signup({ email, password, full_name: name });
    // Log the user in right after signup
    await login(email, password);
  };

  const logout = () => {
    console.log('[auth] logout clicked');
    API.logout().catch(() => {});
    storage.remove(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // Redirect to a safe public route
    try { router.replace('/'); } catch {}
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    // If we have a token, persist to backend
    if (token) {
      const payload: { full_name?: string; password?: string } = {};
      if (typeof updates.name === 'string') payload.full_name = updates.name;
      // Optionally support password change if provided as updates.password
      // @ts-expect-error: our User type doesn't include password by design
      if (typeof updates.password === 'string') payload.password = updates.password;

      try {
        const updated = await API.updateMe(token, payload);
        setUser(toFrontendUser(updated));
        return;
      } catch (e) {
        // If backend update fails, do not overwrite local state silently
        console.error('Failed to update user on server:', e);
      }
    }
    // Fallback: local optimistic update
    setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithPhone,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}