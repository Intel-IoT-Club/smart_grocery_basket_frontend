/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: typeof window !== 'undefined' 
    ? window.location.hostname === 'localhost' 
      ? 'http://localhost:5001'
      : 'https://smart-grocery-basket-backend.onrender.com'
    : 'http://localhost:5001',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Frontend URLs Configuration
export const FRONTEND_CONFIG = {
  PRODUCTION_URL: 'https://smart-grocery-basket-frontend.vercel.app',
  DEVELOPMENT_URL: 'http://localhost:3000',
  CURRENT_URL: typeof window !== 'undefined' 
    ? window.location.hostname === 'localhost' 
      ? 'http://localhost:3000'
      : 'https://smart-grocery-basket-frontend.vercel.app'
    : 'http://localhost:3000',
} as const;

// Application Metadata
export const APP_CONFIG = {
  NAME: 'Smart Grocery Basket',
  VERSION: '1.0.0',
  DESCRIPTION: 'Scan products to add them to your basket with ease',
  AUTHOR: 'Smart Grocery Team',
} as const;

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Dairy',
  'Fruits',
  'Vegetables', 
  'Grocery',
  'Bakery',
  'Beverages',
  'Snacks',
  'Other'
] as const;

// Supported Barcode Formats
export const BARCODE_FORMATS = [
  'code_128',
  'code_39',
  'code_93',
  'codabar',
  'ean_13',
  'ean_8',
  'itf',
  'pdf417',
  'upc_a',
  'upc_e',
  'qr_code'
] as const;

// Scanner Configuration
export const SCANNER_CONFIG = {
  VIDEO_CONSTRAINTS: {
    facingMode: 'environment',
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
  SCAN_INTERVAL: 100, // milliseconds
  DUPLICATE_SCAN_TIMEOUT: 3000, // 3 seconds
  DETECTION_TIMEOUT: 5000, // 5 seconds
} as const;

// UI Constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
  Z_INDEX: {
    MODAL: 1000,
    OVERLAY: 999,
    DROPDOWN: 100,
    STICKY: 50,
  },
} as const;

// Status Messages
export const STATUS_MESSAGES = {
  SCANNER: {
    READY: 'Scanner ready. Tap to start scanning',
    INITIALIZING: 'Initializing camera...',
    SCANNING: 'Hold barcode steady in the frame',
    PROCESSING: 'Processing barcode...',
    SUCCESS: 'Product added successfully',
    ERROR: 'Unable to access camera',
    NOT_SUPPORTED: 'Barcode scanning not supported in this browser',
    PRODUCT_NOT_FOUND: 'Product not found',
    NETWORK_ERROR: 'Network error occurred',
  },
  BASKET: {
    EMPTY: 'Basket is Empty',
    EMPTY_DESCRIPTION: 'Use the barcode scanner to add products to your shopping basket',
    ITEM_ADDED: 'Item added to basket',
    ITEM_UPDATED: 'Quantity updated',
    CLEARED: 'Basket cleared',
  },
} as const;

// CSS Custom Properties (CSS Variables)
export const CSS_VARIABLES = {
  COLORS: {
    BLACK: '--color-black',
    OFF_WHITE: '--color-off-white',
    GREEN: '--color-green',
    DARK_GREEN: '--color-dark-green',
    BRIGHT_GREEN: '--color-bright-green',
    SURFACE: '--color-surface',
    SURFACE_LIGHT: '--color-surface-light',
    BORDER: '--color-border',
    BORDER_LIGHT: '--color-border-light',
  },
  SPACING: {
    XS: '--space-xs',
    SM: '--space-sm', 
    MD: '--space-md',
    LG: '--space-lg',
    XL: '--space-xl',
    XXL: '--space-2xl',
  },
  TYPOGRAPHY: {
    XS: '--text-xs',
    SM: '--text-sm',
    BASE: '--text-base',
    LG: '--text-lg',
    XL: '--text-xl',
    XXL: '--text-2xl',
    XXXL: '--text-3xl',
  },
  SHADOWS: {
    SM: '--shadow-sm',
    MD: '--shadow-md',
    LG: '--shadow-lg',
    XL: '--shadow-xl',
    GREEN: '--shadow-green',
    GREEN_LG: '--shadow-green-lg',
  },
  TRANSITIONS: {
    FAST: '--transition-fast',
    SMOOTH: '--transition-smooth',
    BOUNCE: '--transition-bounce',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: {
    CONNECTION_FAILED: 'Failed to connect to server',
    TIMEOUT: 'Request timeout',
    SERVER_ERROR: 'Server error occurred',
    INVALID_RESPONSE: 'Invalid server response',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_FORMAT: 'Invalid format',
    INVALID_PRODUCT_ID: 'Invalid product ID',
  },
  CAMERA: {
    ACCESS_DENIED: 'Camera access denied',
    NOT_FOUND: 'No camera found',
    NOT_SUPPORTED: 'Camera not supported',
    SECURITY_ERROR: 'Camera access blocked by security policy',
  },
} as const;

// Success Messages  
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED: 'Product added to basket',
  PRODUCT_UPDATED: 'Product quantity updated',
  PRODUCT_REMOVED: 'Product removed from basket',
  BASKET_CLEARED: 'Basket cleared successfully',
  SCAN_SUCCESSFUL: 'Barcode scanned successfully',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  BASKET_ITEMS: 'grocery_basket_items',
  USER_PREFERENCES: 'user_preferences',
  LAST_SCAN_TIME: 'last_scan_time',
  THEME: 'theme_preference',
} as const;

// Default Values
export const DEFAULT_VALUES = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 50,
    MAX_LIMIT: 100,
  },
  PRODUCT: {
    IMAGE: 'https://via.placeholder.com/100',
    CATEGORY: 'Other',
    QUANTITY: 1,
  },
} as const;
