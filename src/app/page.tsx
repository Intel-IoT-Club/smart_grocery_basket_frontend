"use client";

import { useState, useCallback } from 'react';
import GroceryBasket from '../components/GroceryBasket';
import QRScanner from '../components/QRScanner';

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

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-medium text-white text-center">
          Smart Grocery Basket
        </h1>
        <p className="text-sm text-gray-400 text-center mt-1">
          Scan products to add them to your basket
        </p>
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