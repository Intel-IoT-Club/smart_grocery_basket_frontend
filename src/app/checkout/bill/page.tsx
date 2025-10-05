'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { calculateBasketTotals } from '@/utils/index'; // <-- 1. IMPORT THE UTILITY
import { CreditCardIcon } from '@phosphor-icons/react';

export default function BillPage() {
  const { cartItems } = useCart(); // Get items from your cart hook

  // Handle the empty cart case
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h1>
        <Link href="/products" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  // 2. REPLACE LOCAL CALCULATION WITH THE CENTRAL UTILITY FUNCTION
  const { subtotal, formattedSubtotal } = calculateBasketTotals(cartItems);
  const tax = subtotal * 0.05; // Example 5% tax remains component-specific logic
  const totalWithTax = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-950 flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Order Summary</h1>
        
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-4 space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal</span>
            {/* 3. USE THE FORMATTED VALUE FROM THE UTILITY */}
            <span>{formattedSubtotal}</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Taxes (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white font-bold text-xl mt-2">
            <span>Total</span>
            <span>₹{totalWithTax.toFixed(2)}</span>
          </div>
        </div>

        <Link href="/checkout/payment" className="w-full flex justify-center items-center gap-2 mt-8 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors">
          <CreditCardIcon className="w-5 h-5" />
          Proceed to Payment
        </Link>
      </div>
    </div>
  );
}