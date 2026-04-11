"use client";

import { useState } from "react";
import {
  BarcodeIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  PlusCircleIcon
} from '@phosphor-icons/react';

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

interface QRScannerProps {
  onScan: (product: Product) => void;
}

// Dummy data for simulation
const DUMMY_PRODUCTS: Product[] = [
  {
    productId: "123456789",
    name: "Amul Milk (1L)",
    mrpPrice: 60,
    image: "https://placehold.co/100x100?text=Milk",
    category: "Dairy",
    stock: 50,
    discounts: "5% OFF"
  },
  {
    productId: "987654321",
    name: "Whole Wheat Bread",
    mrpPrice: 45,
    image: "https://placehold.co/100x100?text=Bread",
    category: "Bakery",
    stock: 20
  },
  {
    productId: "456789123",
    name: "Lays Classic Salted",
    mrpPrice: 20,
    image: "https://placehold.co/100x100?text=Chips",
    category: "Snacks",
    stock: 100
  },
  {
    productId: "789123456",
    name: "Coca Cola (750ml)",
    mrpPrice: 40,
    image: "https://placehold.co/100x100?text=Coke",
    category: "Beverages",
    stock: 0 // Out of stock test
  }
];

const QRScanner = ({ onScan }: QRScannerProps) => {
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Ready to simulate scan");
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');

  const handleSimulateScan = (product: Product) => {
    setLastScanned(product.name);

    if (product.stock === 0) {
      setStatus(`Out of stock: ${product.name}`);
      setStatusType('error');
      return;
    }

    setStatus(`Scanned: ${product.name}`);
    setStatusType('success');
    onScan(product);

    // Reset status after 2 seconds
    setTimeout(() => {
      setStatus("Ready to simulate scan");
      setStatusType('info');
    }, 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800">
        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
          <BarcodeIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Scanner Simulation</h3>
          <p className="text-sm text-gray-500">Select a product to "scan"</p>
        </div>
      </div>

      {/* Simulation Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-1 gap-3">
          {DUMMY_PRODUCTS.map((product) => (
            <button
              key={product.productId}
              onClick={() => handleSimulateScan(product)}
              className="flex items-center p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-all group text-left"
            >
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4 text-2xl">
                {product.category === 'Dairy' ? '🥛' :
                  product.category === 'Bakery' ? '🍞' :
                    product.category === 'Snacks' ? '🍟' : '🥤'}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400 bg-gray-900 px-2 py-0.5 rounded">
                    ₹{product.mrpPrice}
                  </span>
                  {product.stock === 0 && (
                    <span className="text-xs text-red-400 bg-red-900/20 px-2 py-0.5 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
              <PlusCircleIcon className="w-6 h-6 text-gray-500 group-hover:text-indigo-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-4 bg-gray-950 border-t border-gray-800">
        <div className={`flex items-center gap-3 p-3 rounded-xl ${statusType === 'success' ? 'bg-green-500/10 text-green-400' :
            statusType === 'error' ? 'bg-red-500/10 text-red-400' :
              'bg-gray-800 text-gray-300'
          }`}>
          {statusType === 'success' ? <CheckCircleIcon className="w-5 h-5" /> :
            statusType === 'error' ? <WarningCircleIcon className="w-5 h-5" /> :
              <BarcodeIcon className="w-5 h-5" />}
          <span className="text-sm font-medium">{status}</span>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;