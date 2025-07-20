/**
 * Utility functions for the Smart Grocery Basket application
 */

import { BasketItem, Product } from '../types';
import { STORAGE_KEYS, DEFAULT_VALUES } from '../constants';

/**
 * Format currency values
 */
export const formatCurrency = (amount: number, currency = '₹'): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currency}0.00`;
  }
  return `${currency}${amount.toFixed(2)}`;
};

/**
 * Format date strings
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

/**
 * Check if a date is expired
 */
export const isDateExpired = (dateString: string): boolean => {
  if (!dateString) return false;
  
  try {
    const expiryDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    return expiryDate < today;
  } catch (error) {
    console.error('Date comparison error:', error);
    return false;
  }
};

/**
 * Validate product ID format
 */
export const isValidProductId = (productId: string): boolean => {
  if (!productId || typeof productId !== 'string') return false;
  
  // Product ID should start with 'P' followed by numbers (e.g., P001, P123)
  const productIdRegex = /^P\d{3,}$/;
  return productIdRegex.test(productId);
};

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Generate unique ID for items
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

/**
 * Debounce function to limit function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Throttle function to limit function calls
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Calculate basket totals
 */
export const calculateBasketTotals = (items: BasketItem[]) => {
  const subtotal = items.reduce((total, item) => total + (item.mrpPrice * item.quantity), 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;
  
  return {
    subtotal,
    totalItems,
    deliveryFee,
    total,
    formattedSubtotal: formatCurrency(subtotal),
    formattedTotal: formatCurrency(total),
    formattedDeliveryFee: deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)
  };
};

/**
 * Local Storage utilities
 */
export const storage = {
  /**
   * Set item in localStorage with error handling
   */
  setItem: (key: string, value: any): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  /**
   * Get item from localStorage with error handling
   */
  getItem: <T = any>(key: string, defaultValue: T | null = null): T | null => {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear: (): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

/**
 * Convert Product to BasketItem
 */
export const productToBasketItem = (product: Product, quantity = DEFAULT_VALUES.PRODUCT.QUANTITY): BasketItem => {
  return {
    ...product,
    quantity
  };
};

/**
 * Check if product is in stock
 */
export const isProductInStock = (product: Product): boolean => {
  return (product.stock ?? 0) > 0;
};

/**
 * Get product availability status
 */
export const getProductStatus = (product: Product): { status: string; color: string } => {
  const stock = product.stock ?? 0;
  
  if (stock === 0) {
    return { status: 'Out of Stock', color: 'red' };
  } else if (stock <= 5) {
    return { status: 'Low Stock', color: 'orange' };
  } else {
    return { status: 'In Stock', color: 'green' };
  }
};

/**
 * Format product name for display
 */
export const formatProductName = (name: string, maxLength = 50): string => {
  if (!name) return '';
  
  const sanitized = sanitizeString(name);
  
  if (sanitized.length <= maxLength) {
    return sanitized;
  }
  
  return sanitized.substring(0, maxLength).trim() + '...';
};

/**
 * Generate search keywords from product
 */
export const generateSearchKeywords = (product: Product): string[] => {
  const keywords = [
    product.name,
    product.category,
    product.productId
  ].filter(Boolean);
  
  return keywords.join(' ').toLowerCase().split(/\s+/);
};

/**
 * Check browser capabilities
 */
export const browserCapabilities = {
  /**
   * Check if BarcodeDetector API is supported
   */
  supportsBarcodeDetection: (): boolean => {
    return typeof window !== 'undefined' && 'BarcodeDetector' in window;
  },

  /**
   * Check if getUserMedia is supported
   */
  supportsCamera: (): boolean => {
    return typeof window !== 'undefined' && 
           navigator && 
           navigator.mediaDevices && 
           typeof navigator.mediaDevices.getUserMedia === 'function';
  },

  /**
   * Check if device has camera
   */
  hasCamera: async (): Promise<boolean> => {
    try {
      if (!browserCapabilities.supportsCamera()) return false;
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch {
      return false;
    }
  },

  /**
   * Check if localStorage is available
   */
  supportsLocalStorage: (): boolean => {
    try {
      if (typeof window === 'undefined') return false;
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
};
