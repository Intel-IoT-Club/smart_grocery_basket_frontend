/**
 * TypeScript interfaces and types for the Smart Grocery Basket application
 */

// This interface defines the shape of a product from the database or API
export interface Product {
  productId: string;
  name: string;
  mrpPrice: number;
  image: string;
  discounts?: string;
  category: string;
  stock?: number;
  expiryDate?: string;
}

// This interface defines the shape of an item once it's inside the shopping basket
export interface BasketItem {
  id: string; // Corresponds to productId
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  discounts?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
  timestamp?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ScannerState {
  isScanning: boolean;
  isLoading: boolean;
  scannedData: string;
  status: string;
  statusType: 'info' | 'success' | 'error';
}

export interface QRScannerProps {
  onScan: (product: Product) => void;
}

export interface GroceryBasketProps {
  onProductScanned?: (handler: (product: Product) => void) => void;
}

// Animation variants types for Framer Motion
export interface AnimationVariants {
  [key: string]: {
    [key: string]: any;
  };
}

// Barcode detection types
export interface Barcode {
  rawValue: string;
  format: string;
  boundingBox?: DOMRectReadOnly;
}

export interface BarcodeDetector {
  detect(image: ImageBitmap): Promise<Barcode[]>;
}

// Product categories enum
export enum ProductCategory {
  DAIRY = 'Dairy',
  FRUITS = 'Fruits',
  VEGETABLES = 'Vegetables',
  GROCERY = 'Grocery',
  BAKERY = 'Bakery',
  BEVERAGES = 'Beverages',
  SNACKS = 'Snacks',
  OTHER = 'Other'
}

// Status types for better type safety
export type StatusType = 'info' | 'success' | 'error' | 'warning';

// API endpoints enum
export enum ApiEndpoints {
  PRODUCTS = '/api/products',
  HEALTH = '/health'
}

// Local storage keys
export enum StorageKeys {
  BASKET_ITEMS = 'grocery_basket_items',
  USER_PREFERENCES = 'user_preferences',
  LAST_SCAN_TIME = 'last_scan_time'
}
