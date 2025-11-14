'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../services/authApi';
import QRScanner from '../../components/QRScanner';
import GroceryBasket from '../../components/GroceryBasket';
import { Product } from '../../types';
import { LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [productCallback, setProductCallback] = useState<((product: Product) => void) | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth');
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, user, router]);

  const handleProductScanned = (product: Product) => {
    try {
      if (productCallback && typeof productCallback === 'function') {
        productCallback(product);
      }
    } catch (error) {
      console.error('Error handling scanned product:', error);
    }
  };

  const handleScannedCallback = (handler: (product: Product) => void) => {
    setProductCallback(() => handler);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Smart Grocery Basket
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Welcome, {user?.firstName}!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-900/20 rounded-lg transition flex items-center gap-2 text-gray-400 hover:text-red-400"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>



      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        <div className="grid gap-4 lg:grid-cols-2 h-[calc(100vh-10rem)]">
          <QRScanner onScan={handleProductScanned} />
          <GroceryBasket onProductScanned={handleScannedCallback} />
        </div>
      </main>
    </div>
  );
}
