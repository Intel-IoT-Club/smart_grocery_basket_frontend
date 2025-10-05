"use client";

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { calculateBasketTotals } from '@/utils/index';
import { ShoppingBagIcon, TrashIcon, PlusIcon, MinusIcon, CreditCardIcon } from '@phosphor-icons/react';

// The props are now much simpler as the component gets its data from a global hook.
interface GroceryBasketProps {}

const GroceryBasket = ({}: GroceryBasketProps) => {
  // Use the global state and actions from the hook.
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  // Use the central utility function for all calculations.
  const { totalItems, formattedTotal, formattedSubtotal, formattedDeliveryFee } = calculateBasketTotals(cartItems);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
            <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Basket</h3>
            <p className="text-sm text-gray-500">{totalItems} items</p>
          </div>
        </div>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
            Clear
          </button>
        )}
      </div>

      {/* Basket Content */}
      <div className="flex-1 flex flex-col">
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
            <ShoppingBagIcon className="w-16 h-16 mb-4 text-gray-600" />
            <h4 className="text-lg font-medium text-white mb-2">Basket is Empty</h4>
            <p className="text-sm text-center">
              Use the barcode scanner to add products to your shopping basket.
            </p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-800 rounded-xl">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-700" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{item.name}</h4>
                      <p className="text-sm text-gray-400">{item.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-green-400 font-semibold">
                          ₹{item.price}
                        </span>
                        {item.discounts && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                            {item.discounts}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* The buttons now call the functions from the useCart hook */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
                        <MinusIcon className="w-4 h-4 text-gray-300" />
                      </button>
                      <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors">
                        <PlusIcon className="w-4 h-4 text-gray-300" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors">
                      <TrashIcon className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-gray-800 p-4 space-y-4 bg-gray-800/50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formattedSubtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery</span>
                  <span className="text-green-400">{formattedDeliveryFee}</span>
                </div>
                <div className="border-t border-gray-700 pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-semibold text-green-400 text-lg">{formattedTotal}</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout/bill" className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <CreditCardIcon className="w-5 h-5" />
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GroceryBasket;