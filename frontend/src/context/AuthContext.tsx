import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import * as authService from '../services/authService';
import type { UserData } from '../services/authService';

export type UserRole = 'student' | 'aspirant' | 'organization' | 'professor' | 'professional' | 'recruiter' | 'others' | 'guest';

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  loginUser: (email: string, password: string, rememberMe?: boolean) => Promise<UserData>;
  registerUser: (data: { fullName: string; email: string; password: string; role: string; [key: string]: unknown }) => Promise<UserData>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  updateUser: (updatedData: Partial<UserData> & Record<string, unknown>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // CRITICAL: starts true — blocks ProtectedRoute until hydration completes
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Suppresses ProtectedRoute redirect during intentional logout
  const [role, setRole] = useState<UserRole>('guest');
  const navigate = useNavigate();

  // Hydrate from localStorage on initial load, then verify token against server
  useEffect(() => {
    const hydrate = async () => {
      try {
        const storedToken = authService.getToken();
        const storedUser = authService.getCurrentUser();
        if (!storedToken || !storedUser) {
          return; // Not logged in — nothing to hydrate
        }

        // Step 1: Immediately show cached data for fast UI
        setToken(storedToken);
        setUser(storedUser);
        setRole(storedUser.role as UserRole);

        // Step 2: Verify JWT + fetch latest user from MongoDB (server is the source of truth)
        const { fetchUserProfile } = await import('../services/apiService');
        const freshUser = await fetchUserProfile();
        const { password, __v, ...safeUser } = freshUser as Record<string, unknown>;
        const userData = safeUser as UserData;

        // Step 3: Update React state + storage with server-fresh data
        setUser(userData);
        setRole(userData.role as UserRole);
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(userData));
      } catch {
        // Token expired or invalid — clear everything
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setRole('guest');
      } finally {
        setIsLoading(false); // ALWAYS flip to false, success or failure
      }
    };

    hydrate();
  }, []);

  const loginUser = async (email: string, password: string, rememberMe?: boolean): Promise<UserData> => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password, rememberMe });
      // With discriminators, role-specific fields are top-level
      const { token: authToken, message, ...userData } = data as Record<string, unknown>;
      const userObj = userData as UserData;
      setUser(userObj);
      setToken(authToken as string);
      setRole(userObj.role as UserRole);
      return userObj;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (payload: { fullName: string; email: string; password: string; role: string; [key: string]: unknown }): Promise<UserData> => {
    setIsLoading(true);
    try {
      const data = await authService.register(payload);
      // Do NOT auto-login — clear any token/user the service layer may have stored
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const { token: _token, message, ...userData } = data as Record<string, unknown>;
      return userData as UserData;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Step 1: Signal ALL ProtectedRoutes to stand down BEFORE clearing anything
    setIsLoggingOut(true);

    // Step 2: Clear BOTH storages synchronously while ProtectedRoute is suppressed
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    // Step 3: Clear React context state
    setUser(null);
    setToken(null);
    setRole('guest');

    // Step 4: Navigate directly to home — no intermediate /auth stop
    navigate('/', { replace: true });

    // Step 5: Reset the flag after navigation is committed
    // 300ms ensures the new route is mounted before re-enabling the guard
    setTimeout(() => setIsLoggingOut(false), 300);
  };

  // Instantly sync saved profile data to React state + storage
  const updateUser = (updatedData: Partial<UserData> & Record<string, unknown>) => {
    setUser(prev => {
      if (!prev) return prev;
      const merged = { ...prev, ...updatedData } as UserData;
      // Persist to whichever storage has the token
      const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, role, isAuthenticated, isLoading, isLoggingOut, loginUser, registerUser, logout, setRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
