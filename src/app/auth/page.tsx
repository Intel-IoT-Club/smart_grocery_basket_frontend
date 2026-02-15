'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from '../../components/Login';
import Signup from '../../components/Signup';
import { useAuthStore } from '../../store/authStore';

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const handleAuthSuccess = () => {
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  if (isAuthenticated && user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Smart Grocery Basket</h1>
          <p className="text-gray-400">Smart shopping made easy</p>
        </div>

        {/* Auth Form */}
        {isLoginMode ? (
          <Login
            onSuccess={handleAuthSuccess}
            onSwitchToSignup={() => setIsLoginMode(false)}
          />
        ) : (
          <Signup
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setIsLoginMode(true)}
          />
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Secure login powered by Smart Grocery Basket</p>
        </div>
      </div>
    </div>
  );
}
