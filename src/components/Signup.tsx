'use client';

import { useState, useCallback } from 'react';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../store/authStore';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
  Check,
  X,
} from 'lucide-react';

interface SignupProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  general?: string;
}

export default function Signup({ onSuccess, onSwitchToLogin }: SignupProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setUser, setAccessToken, setError } = useAuthStore();

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^(\+\d{1,3}[-.\s]?)?\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please provide a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

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
        const response = await authApi.register({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phone: formData.phone.trim(),
        });

        if (response.success && response.data) {
          setUser(response.data.user);
          setAccessToken(response.data.accessToken);
          setSuccessMessage('Account created successfully!');

          setTimeout(() => {
            onSuccess?.();
          }, 1000);
        } else {
          if (response.errors) {
            setErrors(response.errors as FormErrors);
          }
          setErrors(prev => ({
            ...prev,
            general: response.error || 'Registration failed',
          }));
          setError(response.error || 'Registration failed');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        setErrors({ general: errorMessage });
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm, setUser, setAccessToken, setError, onSuccess]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>

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

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="John"
                className={`w-full px-3 py-2 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none transition ${
                  errors.firstName
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-0.5">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Doe"
                className={`w-full px-3 py-2 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none transition ${
                  errors.lastName
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-0.5">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-3 py-2 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none transition ${
                  errors.email
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-0.5">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Min 8 characters"
                className={`w-full pl-10 pr-10 py-2 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none transition ${
                  errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Re-enter password"
                className={`w-full pl-10 pr-10 py-2 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none transition ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {formData.confirmPassword && (
              <div className="mt-1 flex items-center gap-2">
                {formData.password === formData.confirmPassword ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-400">Passwords match</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-red-500" />
                    <span className="text-xs text-red-400">Passwords don't match</span>
                  </>
                )}
              </div>
            )}

            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="10-digit phone number"
              className={`w-full px-3 py-2 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none transition ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-700 focus:border-blue-500'
              }`}
              disabled={isLoading}
            />
            {errors.phone && <p className="text-red-400 text-xs mt-0.5">{errors.phone}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium rounded transition flex items-center justify-center gap-2 mt-4"
          >
            {isLoading && <Loader className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
