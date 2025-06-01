"use client";

import { useState, useEffect } from 'react';

interface Product {
  productId: string;
  name: string;
  mrpPrice: number;
  image: string;
  discounts?: string;
  category: string;
}

interface BasketItem {
  id: string;
  name: string;
  price: number;
  image: string;
  discount?: string;
  category: string;
  quantity: number;
}

interface GroceryBasketProps {
  onProductScanned?: (handler: (product: Product) => void) => void;
}

const GroceryBasket = ({ onProductScanned }: GroceryBasketProps) => {
  const [items, setItems] = useState<BasketItem[]>([]);

  const handleProductScanned = (product: Product) => {
    setItems(currentItems => {
      // Map the backend product to our basket format
      const basketProduct: BasketItem = {
        id: product.productId,
        name: product.name,
        price: product.mrpPrice,
        image: product.image,
        discount: product.discounts,
        category: product.category,
        quantity: 1
      };

      const existingItemIndex = currentItems.findIndex(item => item.id === basketProduct.id);
      
      if (existingItemIndex !== -1) {
        // Create a new array with the updated item
        const newItems = [...currentItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      }
      
      // Add new item with quantity 1
      return [...currentItems, basketProduct];
    });
  };

  const handleUpdateQuantity = (productId: string, change: number) => {
    setItems(currentItems => {
      return currentItems.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleClearBasket = () => {
    setItems([]);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  // Register the callback to handle product scanning
  useEffect(() => {
    if (onProductScanned) {
      onProductScanned(handleProductScanned);
    }
  }, [onProductScanned]);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white flex justify-between items-center py-3 px-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-0 flex items-center">
          <i className="fas fa-shopping-basket mr-2" style={{ color: '#00a76f' }}></i>
          Smart Grocery Basket
        </h2>
        <button 
          onClick={handleClearBasket} 
          className="btn-outline-danger px-3 py-2 text-sm font-medium rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={items.length === 0}
        >
          <i className="fas fa-trash mr-1"></i>
          Clear
        </button>
      </div>
      
      <div className="p-4">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-shopping-cart text-5xl mb-4"></i>
            <p className="text-lg mb-2">Your basket is empty</p>
            <p className="text-sm">Scan a product to add items</p>
          </div>
        ) : (
          <div className="mb-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center border-b border-gray-200 py-3 last:border-b-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="mr-3 rounded object-cover" 
                  style={{ width: '64px', height: '64px' }} 
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                  <div className="flex flex-wrap items-center">
                    <p className="text-gray-600 mb-0 mr-3">₹{item.price}</p>
                    {item.discount && (
                      <p className="mb-0 text-green-600 text-sm flex items-center">
                        <i className="fas fa-tag mr-1"></i>
                        {item.discount}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, -1)} 
                    className="btn-outline-secondary"
                    aria-label="Decrease quantity"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="mx-3 font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, 1)} 
                    className="btn-outline-secondary"
                    aria-label="Increase quantity"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {items.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center border-t border-gray-200 pt-3">
              <h3 className="text-xl font-semibold mb-0">Total</h3>
              <h3 className="text-xl font-semibold mb-0">₹{calculateTotal()}</h3>
            </div>
            
            <div className="mt-3">
              <button className="btn-success w-full text-white font-semibold">
                <i className="fas fa-credit-card mr-2"></i>
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryBasket;