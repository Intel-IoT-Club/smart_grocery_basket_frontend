import { LoginCredentials, SignupData, AuthResponse } from '@/types/auth';
import { API_CONFIG } from '@/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || API_CONFIG.BASE_URL;

export const register = async (data: Omit<SignupData, 'confirmPassword'>): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Registration failed');
  }

  return response.json();
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Login failed');
  }

  return response.json();
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};