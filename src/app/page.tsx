"use client";

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import GroceryBasket from '../components/GroceryBasket';
import QRScanner from '../components/QRScanner';
import { QrCodeIcon } from '@phosphor-icons/react';

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
 * Main application page component with enhanced functionality and better practices
 */
const HomePage = () => {
  const [productCallback, setProductCallback] = useState<((product: Product) => void) | null>(null);
  
  /**
   * Handle product scanning callback registration
   * Uses useCallback to prevent unnecessary re-renders and improve performance
   */
  const handleScannedCallback = useCallback((handler: (product: Product) => void) => {
    setProductCallback(() => handler);
  }, []);
  
  /**
   * Handle product scanned event with proper error handling
   */
  const handleProductScanned = useCallback((product: Product) => {
    try {
      if (productCallback && typeof productCallback === 'function') {
        productCallback(product);
      }
    } catch (error) {
      console.error('Error handling scanned product:', error);
      // Could add user notification here
    }
  }, [productCallback]);

  return (
    <div className="min-h-screen bg-[var(--color-black)] flex flex-col">
      {/* Enhanced Header with Animation and Better Semantics */}
      <header className="bg-[var(--color-dark-green)] text-[var(--color-off-white)] shadow-xl">
        <div className="container mx-auto px-6 py-10 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center md:justify-start"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[var(--color-green)]/20">
                <QrCodeIcon 
                  size={32} 
                  className="text-[var(--color-green)]" 
                  weight="duotone" 
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  Smart Grocery Basket
                </h1>
                <p className="text-[var(--color-off-white)]/70 text-sm mt-2 hidden sm:block">
                  Scan products to add them to your basket with ease
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content with Enhanced Layout and Accessibility */}
      <main 
        className="flex-grow container mx-auto px-6 py-10 md:py-12 flex items-center"
        role="main"
        aria-label="Main application content"
      >
        <motion.div 
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Scanner Section with Enhanced Animation */}
            <motion.div 
              className="lg:col-span-5 xl:col-span-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <QRScanner onScan={handleProductScanned} />
            </motion.div>

            {/* Basket Section with Enhanced Animation */}
            <motion.div 
              className="lg:col-span-7 xl:col-span-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GroceryBasket onProductScanned={handleScannedCallback} />
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Enhanced Footer with Better Information Architecture */}
      <footer className="mt-auto py-8 border-t border-[var(--color-dark-green)]">
        <motion.div 
          className="container mx-auto px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[var(--color-off-white)]/70 text-sm text-center sm:text-left">
              © 2025 Smart Grocery Basket. Professional shopping solution.
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--color-off-white)]/50">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Built with React & Next.js</span>
            </div>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default HomePage;