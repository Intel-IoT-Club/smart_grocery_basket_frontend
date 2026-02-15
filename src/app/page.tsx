'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/authApi';
import GroceryBasket from '../components/GroceryBasket';
import QRScanner from '../components/QRScanner';
import { LogIn, LogOut } from 'lucide-react';

// Use the Product interface from types with all necessary fields
interface Product {
  productId: string;
  name: string;
  mrpPrice: number;
  image: string;
  discounts?: string;
  category: string;
  stock?: number;
  expiryDate?: string;
}

/**
 * Main application page component with minimalistic design
 */
export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [productCallback, setProductCallback] = useState<((product: Product) => void) | null>(null);

  /**
   * Handle product scanning callback registration
   */
  const handleScannedCallback = useCallback((handler: (product: Product) => void) => {
    setProductCallback(() => handler);
  }, []);

  /**
   * Handle product scanned event
   */
  const handleProductScanned = useCallback((product: Product) => {
    try {
      if (productCallback && typeof productCallback === 'function') {
        productCallback(product);
      }
    } catch (error) {
      console.error('Error handling scanned product:', error);
    }
  }, [productCallback]);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      // Logout
      try {
        await authApi.logout();
        clearAuth();
        router.push('/');
      } catch (error) {
        console.error('Logout failed:', error);
        clearAuth();
        router.push('/');
      }
    } else {
      // Login
      router.push('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-medium text-white">
              Smart Grocery Basket
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {isAuthenticated && user ? `Welcome, ${user.firstName}!` : 'Scan products to add them to your basket'}
            </p>
          </div>

          <button
            onClick={handleAuthAction}
            className={`flex items-center gap-2 px-4 py-2 rounded transition text-sm font-medium ${
              isAuthenticated
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAuthenticated ? (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        <div className="grid gap-4 lg:grid-cols-2 h-[calc(100vh-8rem)]">
          <QRScanner onScan={handleProductScanned} />
          <GroceryBasket onProductScanned={handleScannedCallback} />
        </div>
      </main>
    </div>
  );
}
