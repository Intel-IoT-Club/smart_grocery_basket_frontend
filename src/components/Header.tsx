'use client';

import { useAuthStore } from '../store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '../services/authApi';
import { LogOut, User, ShoppingCart } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      clearAuth();
      router.push('/');
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <ShoppingCart className="w-6 h-6 text-blue-500 group-hover:text-blue-400 transition" />
          <h1 className="text-xl font-bold text-white group-hover:text-gray-200 transition">
            Smart Grocery Basket
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-white transition text-sm sm:text-base"
              >
                Dashboard
              </Link>

              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm hidden sm:inline">
                  {user.firstName}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 rounded transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm sm:text-base font-medium"
            >
              Login / Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
