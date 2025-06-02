"use client";

import { useState } from 'react';
import GroceryBasket from '../components/GroceryBasket';
import QRScanner from '../components/QRScanner';
import { 
  QrCodeIcon, 
  TagSimpleIcon 
} from '@phosphor-icons/react';

interface Product {
  productId: string;
  name: string;
  mrpPrice: number;
  image: string;
  discounts?: string;
  category: string;
}

const App = () => {
  const [productCallback, setProductCallback] = useState<((product: Product) => void) | null>(null);
  
  const handleScannedCallback = (handler: (product: Product) => void) => {
    setProductCallback(() => handler);
  };
  
  const handleProductScanned = (product: Product) => {
    if (productCallback && typeof productCallback === 'function') {
      productCallback(product);
    }
  };
  
  return (
    <div className="min-h-screen bg-[var(--color-black)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--color-dark-green)] text-[var(--color-off-white)] shadow-xl">
        <div className="container mx-auto px-6 py-10 md:py-12">
          <div className="flex items-center justify-center md:justify-start">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Smart Grocery Basket
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-10 md:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Scanner Section */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div>
              <QRScanner onScan={handleProductScanned} />
            </div>
          </div>

          {/* Basket Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <GroceryBasket onProductScanned={handleScannedCallback} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-[var(--color-dark-green)]">
        <div className="container mx-auto px-6">
          <p className="text-[var(--color-off-white)]/70 text-sm text-center">
            © 2025 Smart Grocery Application. Professional shopping solution.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;