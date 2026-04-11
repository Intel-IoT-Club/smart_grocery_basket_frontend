export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'owner' | 'customer';
}

export interface AuthResponse {
  success: boolean;
  data?: {
    _id: string;
    username: string;
    email: string;
    role: 'owner' | 'customer';
    token: string;
  };
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: 'owner' | 'customer';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}