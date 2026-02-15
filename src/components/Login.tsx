'use client';

import { useState, useCallback } from 'react';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface LoginProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login({ onSuccess, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { setUser, setAccessToken, setError } = useAuthStore();

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSuccessMessage('');
      setErrors({});

      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      try {
        const response = await authApi.login({
          email: email.toLowerCase(),
          password,
        });

        if (response.success && response.data) {
          setUser(response.data.user);
          setAccessToken(response.data.accessToken);
          setSuccessMessage('Login successful!');

          setTimeout(() => {
            onSuccess?.();
          }, 1000);
        } else {
          setErrors({
            general: response.error || 'Login failed',
          });
          setError(response.error || 'Login failed');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        setErrors({ general: errorMessage });
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, validateForm, setUser, setAccessToken, setError, onSuccess]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-900/20 border border-green-700 rounded flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-400 text-sm">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none transition ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-2 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none transition ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium rounded transition flex items-center justify-center gap-2"
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-400 hover:text-blue-300 transition"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
