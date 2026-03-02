import api from './api';

// The backend response now includes role-specific fields at the top level
// (via Mongoose Discriminators), plus base fields and token.
export interface AuthResponse {
  success: boolean;
  _id: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
  message?: string;
  [key: string]: unknown; // Role-specific fields (collegeName, degree, skills, etc.)
}

export interface UserData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  [key: string]: unknown; // Role-specific fields
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: string;
  [key: string]: unknown; // Role-specific profile fields
}

interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Extract UserData from the API response (strips token and internal fields).
 */
const extractUserData = (data: AuthResponse): UserData => {
  const { success, token, message, __v, password, ...userData } = data as Record<string, unknown>;
  return userData as UserData;
};

/**
 * Determine which storage to use.
 * If rememberMe is true → localStorage (persists across tabs/sessions).
 * If false → sessionStorage (clears on tab close).
 */
const getStorage = (rememberMe: boolean): Storage => {
  return rememberMe ? localStorage : sessionStorage;
};

/**
 * Register a new user
 */
export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', payload);
  const data = response.data;
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(extractUserData(data)));
  }
  return data;
};

/**
 * Log in an existing user
 */
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', payload);
  const data = response.data;
  const rememberMe = payload.rememberMe ?? false;

  if (data.token) {
    const storage = getStorage(rememberMe);
    storage.setItem('token', data.token);
    storage.setItem('user', JSON.stringify(extractUserData(data)));

    // Clear the OTHER storage to avoid stale data
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    otherStorage.removeItem('token');
    otherStorage.removeItem('user');
  }
  return data;
};

/**
 * Log out — clears BOTH storages
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};

/**
 * Get the currently stored user (check localStorage first, then sessionStorage)
 */
export const getCurrentUser = (): UserData | null => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Get the stored token (check localStorage first, then sessionStorage)
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};
