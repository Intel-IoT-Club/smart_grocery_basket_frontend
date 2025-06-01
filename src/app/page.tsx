"use client";

import { useState } from 'react';
import GroceryBasket from '../components/GroceryBasket';
import QRScanner from '../components/QRScanner';

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
    <>
      <div className="navbar-container py-4 text-white">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-0">Smart Grocery Basket</h1>
          <p className="mt-2">Scan products to add them to your basket</p>
        </header>
      </div>

      {/* Main App Container */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <QRScanner onScan={handleProductScanned} />
          </div>
          <div className="lg:col-span-8">
            <GroceryBasket onProductScanned={handleScannedCallback} />
          </div>
        </div>

        <footer className="mt-12 pt-3 text-center text-gray-500 border-t border-gray-200">
          <p className="text-sm">© 2025 Smart Grocery App</p>
        </footer>
      </div>
    </>
  );
};

export default App;