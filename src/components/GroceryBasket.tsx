"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBagIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  CreditCardIcon,
  TagSimpleIcon,
  ShoppingCartSimpleIcon 
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    scale: 0.95,
    transition: { duration: 0.2 } 
  }
};

const bounceVariants = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.1, 1],
    transition: { duration: 0.3 }
  }
};

const GroceryBasket = ({ onProductScanned }: GroceryBasketProps) => {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [isAnimating, setIsAnimating] = useState<string | null>(null);

  const handleProductScanned = (product: Product) => {
    setItems(currentItems => {
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
        setIsAnimating(basketProduct.id);
        setTimeout(() => setIsAnimating(null), 300);
        
        const newItems = [...currentItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1
        };
        return newItems;
      }
      
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

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    if (onProductScanned) {
      onProductScanned(handleProductScanned);
    }
  }, [onProductScanned]);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="card h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-subtle">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: 'var(--color-dark-green)' }}>
            <ShoppingBagIcon 
              weight="duotone"
              className="h-6 w-6" 
              style={{ color: 'var(--color-green)' }} 
            />
          </div>
          <div>
            <h2 className="heading-tertiary mb-1">
              Shopping Basket
            </h2>
            {items.length > 0 && (
              <p className="text-sm text-muted">
                {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} added
              </p>
            )}
          </div>
        </div>
        
        <motion.button 
          onClick={handleClearBasket} 
          disabled={items.length === 0}
          className="btn btn-secondary btn-sm focus-ring"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Clear all items from basket"
        >
          <TrashIcon weight="bold" className="h-4 w-4" />
          Clear All
        </motion.button>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="p-6 rounded-full mb-6" style={{ background: 'var(--color-surface-light)' }}>
              <ShoppingCartSimpleIcon weight="duotone" className="h-16 w-16 text-muted" />
            </div>
            <h3 className="heading-tertiary mb-3">
              Basket is Empty
            </h3>
            <p className="text-muted text-sm max-w-sm leading-relaxed">
              Use the barcode scanner to add products to your shopping basket
            </p>
          </motion.div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto p-6 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={isAnimating === item.id ? bounceVariants : itemVariants}
                    initial="hidden"
                    animate={isAnimating === item.id ? "animate" : "visible"}
                    exit="exit"
                    layout
                    className="card-light p-4 hover:border-accent transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-subtle">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                            loading="lazy"
                          />
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-tight mb-2 truncate" style={{ color: 'var(--color-off-white)' }}>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="font-bold text-base" style={{ color: 'var(--color-green)' }}>
                            ₹{item.price}
                          </span>
                          {item.discount && (
                            <div className="status-badge success">
                              <TagSimpleIcon weight="fill" className="h-3 w-3" />
                              <span className="text-xs font-medium">{item.discount}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted font-medium">
                          Category: {item.category}
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <motion.button 
                          onClick={() => handleUpdateQuantity(item.id, -1)} 
                          className="btn btn-circle btn-sm btn-secondary focus-ring"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon weight="bold" className="h-4 w-4" />
                        </motion.button>
                        
                        <motion.span 
                          key={item.quantity}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="font-bold text-lg min-w-[2.5rem] text-center"
                          style={{ color: 'var(--color-off-white)' }}
                        >
                          {item.quantity}
                        </motion.span>
                        
                        <motion.button 
                          onClick={() => handleUpdateQuantity(item.id, 1)} 
                          className="btn btn-circle btn-sm btn-secondary focus-ring"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="Increase quantity"
                        >
                          <PlusIcon weight="bold" className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Item Total */}
                    <div className="mt-3 pt-3 border-t border-subtle flex justify-between items-center">
                      <span className="text-sm text-muted">
                        Subtotal ({item.quantity} × ₹{item.price})
                      </span>
                      <span className="font-bold text-base" style={{ color: 'var(--color-bright-green)' }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
        
        {/* Total & Checkout */}
        {items.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-subtle p-6 space-y-6"
            style={{ background: 'var(--color-surface-light)' }}
          >
            {/* Order Summary */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Items ({getTotalItems()})</span>
                <span className="font-medium" style={{ color: 'var(--color-off-white)' }}>
                  ₹{calculateTotal()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Delivery Fee</span>
                <span className="font-medium text-accent">Free</span>
              </div>
              <div className="border-t border-subtle pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg" style={{ color: 'var(--color-off-white)' }}>
                    Total Amount
                  </span>
                  <motion.span 
                    key={calculateTotal()}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="font-bold text-2xl"
                    style={{ color: 'var(--color-green)' }}
                  >
                    ₹{calculateTotal()}
                  </motion.span>
                </div>
              </div>
            </div>
            
            <motion.button 
              className="btn btn-primary btn-lg w-full focus-ring"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Proceed to payment"
            >
              <CreditCardIcon weight="bold" className="h-5 w-5" />
              Proceed to Payment
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GroceryBasket;