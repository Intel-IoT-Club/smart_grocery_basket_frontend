'use client';

import { API_CONFIG } from '../constants';
import axios, { AxiosInstance, AxiosError } from 'axios';

interface ApiError extends Error {
  status?: number;
  code?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      fullName: string;
      role?: string;
    };
    accessToken: string;
    expiresIn: string;
  };
  errors?: Record<string, string>;
  suggestions?: string[];
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  phone: string;
  address?: any;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

class AuthApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.client.post('/api/auth/refresh', {
                refreshToken,
              });

              const newAccessToken = response.data.data.accessToken;
              this.setAccessToken(newAccessToken);

              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearAuth();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  private setAccessToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  private clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.client.post<AuthResponse>('/api/auth/register', data);
      if (response.data.data) {
        this.setAccessToken(response.data.data.accessToken);
      }
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await this.client.post<AuthResponse>('/api/auth/login', data);
      if (response.data.data) {
        this.setAccessToken(response.data.data.accessToken);
      }
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(): Promise<{ success: boolean }> {
    try {
      const response = await this.client.post('/api/auth/logout');
      this.clearAuth();
      return response.data;
    } catch (error) {
      this.clearAuth();
      return { success: true };
    }
  }

  async getProfile(): Promise<{ success: boolean; data?: UserProfile }> {
    try {
      const response = await this.client.get<{ success: boolean; data: UserProfile }>(
        '/api/auth/me'
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateProfile(data: Partial<UserProfile>): Promise<AuthResponse> {
    try {
      const response = await this.client.put<AuthResponse>('/api/auth/profile', data);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await this.client.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): any {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;

      if (status === 400) {
        return {
          success: false,
          error: data?.error || 'Invalid input',
          errors: data?.errors || {},
        };
      }

      if (status === 409) {
        return {
          success: false,
          error: data?.error || 'Email already registered',
        };
      }

      if (status === 429) {
        return {
          success: false,
          error: 'Too many attempts. Please try again later.',
        };
      }

      return {
        success: false,
        error: data?.error || error.message || 'Request failed',
      };
    }

    return {
      success: false,
      error: 'Network error. Please check your connection.',
    };
  }
}

export const authApi = new AuthApiClient();
