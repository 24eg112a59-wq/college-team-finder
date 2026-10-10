import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem('auth');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem('auth');
      return null;
    }
  });
  const [ready, setReady] = useState(() => !localStorage.getItem('auth'));
  const shouldRestoreSession = useRef(Boolean(auth));

  useEffect(() => {
    if (!shouldRestoreSession.current) return;
    shouldRestoreSession.current = false;
    if (!auth) return;
    apiService.auth.me()
      .then(({ data }) => {
        localStorage.setItem('auth', JSON.stringify(data));
        setAuth(data);
      })
      .catch(() => {
        localStorage.removeItem('auth');
        setAuth(null);
      })
      .finally(() => setReady(true));
  }, [auth]);

  const login = useCallback((authData) => {
    localStorage.setItem('auth', JSON.stringify(authData));
    setAuth(authData);
  }, []);

  const logout = useCallback(() => {
    apiService.auth.logout().catch(() => {});
    localStorage.removeItem('auth');
    setAuth(null);
  }, []);

  const value = useMemo(() => ({ auth, login, logout, ready }), [auth, login, logout, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
