# Smart Grocery Basket - Frontend Application

A modern Progressive Web Application (PWA) for barcode scanning grocery shopping built with Next.js 15, React 18, and TypeScript. Features real-time barcode detection, shopping basket management, and responsive design optimized for mobile-first grocery shopping experiences.

## Architecture Overview

This frontend application implements a component-based architecture using Next.js App Router with server-side rendering capabilities. The system follows modern React patterns with TypeScript for type safety, custom hooks for state management, and a service layer for API communication.

## Technical Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | Next.js | 15.3.3 | Full-stack React framework with App Router |
| **Runtime** | React | 18.2.0 | Component-based UI library |
| **Language** | TypeScript | 5.0+ | Static type checking and development experience |
| **Styling** | TailwindCSS | 4.0.0 | Utility-first CSS framework |
| **Icons** | Phosphor Icons | 2.1.10 | Comprehensive icon library |
| **Icons Alternative** | Lucide React | 0.263.1 | Additional icon components |
| **Build System** | Next.js Compiler | Built-in | Rust-based SWC compiler |
| **Type Checking** | TypeScript Compiler | 5.0+ | Static analysis and type validation |

## System Architecture

### Application Structure
```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx          # Root layout with metadata and viewport config
│   ├── page.tsx            # Main application page with state management
│   └── globals.css         # Global styles and custom CSS properties
├── components/             # Reusable React components
│   ├── GroceryBasket.tsx   # Shopping basket management component
│   └── QRScanner.tsx       # Barcode scanning interface component
├── services/               # External service integrations
│   └── api.ts              # HTTP client with retry logic and error handling
├── types/                  # TypeScript type definitions
│   └── index.ts            # Shared interfaces and type definitions
├── constants/              # Application constants and configuration
│   └── index.ts            # API endpoints, UI constants, and app configuration
└── utils/                  # Utility functions and helpers
    └── index.ts            # Data formatting, validation, and browser utilities
```

## Core Components

### 1. QRScanner Component

#### Technical Implementation
- **Camera Access**: Utilizes `navigator.mediaDevices.getUserMedia()` for camera stream
- **Barcode Detection**: Implements Web APIs `BarcodeDetector` for real-time scanning
- **Frame Processing**: Uses `ImageCapture.grabFrame()` for frame-by-frame analysis
- **Error Handling**: Comprehensive error states for camera access, detection failures, and network issues

#### Supported Barcode Formats
```typescript
const SUPPORTED_FORMATS = [
  'code_128', 'code_39', 'code_93', 'codabar',
  'ean_13', 'ean_8', 'itf', 'pdf417',
  'upc_a', 'upc_e', 'qr_code'
];
```

#### State Management
```typescript
interface ScannerState {
  isScanning: boolean;      // Camera active state
  isLoading: boolean;       // Processing state
  scannedData: string;      // Last scanned barcode
  status: string;           // User feedback message
  statusType: 'info' | 'success' | 'error';
}
```

#### Key Features
- Duplicate scan prevention with 3-second cooldown
- Automatic product lookup via API integration
- Real-time status feedback with visual indicators
- Camera permission handling and fallback states
- Performance-optimized scanning with 100ms intervals

### 2. GroceryBasket Component

#### Technical Implementation
- **State Management**: React hooks for cart state with localStorage persistence
- **Product Management**: Add, remove, and quantity update operations
- **Price Calculations**: Real-time total calculation with quantity-based pricing
- **Persistence**: Browser storage for cart continuity across sessions

#### Data Structures
```typescript
interface BasketItem {
  id: string;           // Unique product identifier
  name: string;         // Product display name
  price: number;        // Unit price in currency
  image: string;        // Product image URL
  discount?: string;    // Discount information
  category: string;     // Product category
  quantity: number;     // Item quantity in basket
}
```

#### Core Operations
- **Add Product**: Increment quantity if exists, create new item if not
- **Update Quantity**: Modify item quantities with validation
- **Remove Item**: Delete items from basket with confirmation
- **Calculate Totals**: Real-time price computation with formatting
- **Clear Basket**: Reset all items with state cleanup

### 3. API Service Layer

#### HTTP Client Implementation
```typescript
class ApiClient {
  private baseURL: string;
  private timeout: number = 10000;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;
}
```

#### Features
- **Automatic Retries**: Exponential backoff for failed requests
- **Timeout Handling**: Request timeout with configurable limits
- **Error Transformation**: Structured error responses with status codes
- **Environment Detection**: Dynamic API endpoint selection

#### Product Service Methods
```typescript
class ProductService extends ApiClient {
  async getProducts(filters): Promise<ApiResponse<Product[]>>
  async getProductById(id): Promise<ApiResponse<Product>>
  async searchByBarcode(barcode): Promise<Product | null>
  async createProduct(data): Promise<ApiResponse<Product>>
  async updateProduct(id, data): Promise<ApiResponse<Product>>
  async deleteProduct(id): Promise<ApiResponse<void>>
}
```

## Type System Architecture

### Core Interfaces
```typescript
interface Product {
  productId: string;        // Unique identifier (format: P001, P002, etc.)
  name: string;            // Product display name
  mrpPrice: number;        // Maximum Retail Price
  image: string;           // Product image URL
  discounts?: string;      // Discount description
  category: ProductCategory; // Enum-based category
  stock?: number;          // Available inventory
  expiryDate?: string;     // Expiration date (YYYY-MM-DD)
}

interface ApiResponse<T = any> {
  success: boolean;        // Operation success status
  data?: T;               // Response payload
  error?: string;         // Error message
  message?: string;       // Success message
  pagination?: PaginationInfo; // Pagination metadata
  timestamp?: string;     // Response timestamp
}

enum ProductCategory {
  DAIRY = 'Dairy',
  FRUITS = 'Fruits',
  VEGETABLES = 'Vegetables',
  GROCERY = 'Grocery',
  BAKERY = 'Bakery',
  BEVERAGES = 'Beverages',
  SNACKS = 'Snacks',
  OTHER = 'Other'
}
```

## Browser API Integration

### Barcode Detection API
The application leverages the modern Web API for barcode detection:

```typescript
interface BarcodeDetector {
  detect(image: ImageBitmap): Promise<Barcode[]>;
}

interface Barcode {
  rawValue: string;        // Detected barcode value
  format: string;          // Barcode format type
  boundingBox?: DOMRectReadOnly; // Detection coordinates
}
```

### Browser Compatibility Requirements
- **Chrome/Chromium**: ≥90 (BarcodeDetector API support)
- **Firefox**: ≥88 (MediaDevices API support)
- **Safari**: ≥14 (ImageCapture API support)
- **Edge**: ≥90 (Full API compatibility)

### Feature Detection
```typescript
const browserCapabilities = {
  supportsBarcodeDetection: () => 'BarcodeDetector' in window,
  supportsCamera: () => 'mediaDevices' in navigator,
  supportsImageCapture: () => 'ImageCapture' in window,
  supportsLocalStorage: () => typeof Storage !== 'undefined'
};
```

## Configuration Management

### Environment-Based Configuration
```typescript
const API_CONFIG = {
  BASE_URL: typeof window !== 'undefined' 
    ? window.location.hostname === 'localhost' 
      ? 'http://localhost:5001'
      : 'https://smart-grocery-basket-backend.onrender.com'
    : 'http://localhost:5001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};
```

### Scanner Configuration
```typescript
const SCANNER_CONFIG = {
  VIDEO_CONSTRAINTS: {
    facingMode: 'environment',    // Rear camera preference
    width: { ideal: 1280 },       // Optimal resolution
    height: { ideal: 720 },
  },
  SCAN_INTERVAL: 100,             // Frame processing frequency (ms)
  DUPLICATE_SCAN_TIMEOUT: 3000,   // Cooldown period (ms)
  DETECTION_TIMEOUT: 5000,        // Max detection time (ms)
};
```

## User Interface Design

### Design System
- **Color Scheme**: Dark mode with gray-950 primary background
- **Typography**: System font stack with optimal readability
- **Spacing**: Consistent 4px grid system
- **Border Radius**: Modern rounded corners (8px, 12px, 16px)
- **Animations**: Subtle transitions with reduced motion support

### Responsive Design
- **Mobile-First**: Optimized for smartphone usage
- **Breakpoints**: Standard TailwindCSS breakpoints (sm: 640px, md: 768px, lg: 1024px)
- **Grid System**: Flexible grid layout with responsive columns
- **Touch Targets**: Minimum 44px touch targets for accessibility

### Accessibility Features
- **Focus Management**: Visible focus indicators with 2px outline
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Keyboard Navigation**: Full keyboard accessibility

## State Management Strategy

### Local State Management
- **Component State**: React `useState` for component-specific data
- **Effect Management**: `useEffect` for side effects and cleanup
- **Callback Optimization**: `useCallback` for performance optimization
- **Reference Management**: `useRef` for DOM access and mutable values

### Data Persistence
```typescript
const storage = {
  setItem: (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: <T>(key: string, defaultValue: T | null = null): T | null => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  }
};
```

### State Synchronization
- **Parent-Child Communication**: Props-based data flow
- **Event Handling**: Callback functions for state updates
- **Side Effect Management**: Proper cleanup in useEffect hooks

## Performance Optimizations

### Code Splitting
- **Route-Based Splitting**: Next.js automatic code splitting
- **Component Lazy Loading**: Dynamic imports for heavy components
- **Bundle Analysis**: Built-in bundle analyzer support

### Image Optimization
- **Next.js Image Component**: Automatic optimization and lazy loading
- **Format Selection**: WebP support with fallbacks
- **Responsive Images**: Multiple size variants

### Runtime Performance
- **Debounced Scanning**: Prevents excessive API calls
- **Memoization**: React.memo and useMemo for expensive operations
- **Efficient Re-renders**: Optimized dependency arrays

## Development Workflow

### Prerequisites
```bash
Node.js ≥18.0.0
npm ≥8.0.0
Modern browser with camera support
Backend API running (see backend repository)
```

### Setup Process
```bash
# Repository setup
git clone https://github.com/Intel-IoT-Club/smart_grocery_basket_frontend.git
cd smart_grocery_basket_frontend

# Dependency installation
npm install

# Development server with Turbopack
npm run dev

# Build optimization
npm run build

# Production server
npm start
```

### Development Scripts
```bash
npm run dev          # Next.js development server with hot reload
npm run build        # Production build with optimizations
npm start            # Production server
npm run lint         # ESLint code analysis
npm run type-check   # TypeScript compilation check
```

### Build Configuration
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // External image domains
  },
  experimental: {
    turbopack: true,        // Rust-based bundler
  },
};
```

## Security Implementation

### Input Sanitization
```typescript
const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')           // Remove HTML tags
    .replace(/javascript:/gi, '')    // Remove JavaScript URLs
    .replace(/on\w+=/gi, '');       // Remove event handlers
};
```

### API Security
- **HTTPS Enforcement**: Production HTTPS requirements
- **CORS Handling**: Proper cross-origin request handling
- **Input Validation**: Client-side validation with server-side verification
- **Error Information**: Sanitized error messages to prevent information leakage

## Progressive Web App Features

### Metadata Configuration
```typescript
export const metadata: Metadata = {
  title: "Smart Grocery Basket",
  description: "Scan products to add them to your basket with ease",
  keywords: ["grocery", "shopping", "barcode", "scanner", "mobile"],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#111827",
};
```

### Mobile Optimization
- **App-like Experience**: Full-screen mobile web app
- **Status Bar Styling**: Translucent status bar for iOS
- **Viewport Management**: Optimal mobile viewport configuration
- **Touch Optimization**: Touch-friendly interface design

## Error Handling Strategy

### Error Boundaries
- **Component-Level Errors**: Graceful component error handling
- **API Error Handling**: Structured error responses with user-friendly messages
- **Network Error Recovery**: Automatic retry mechanisms with exponential backoff

### User Feedback
```typescript
const STATUS_MESSAGES = {
  SCANNER: {
    READY: 'Scanner ready. Tap to start scanning',
    INITIALIZING: 'Initializing camera...',
    SCANNING: 'Hold barcode steady in the frame',
    ERROR: 'Unable to access camera',
    NOT_SUPPORTED: 'Barcode scanning not supported in this browser'
  },
  BASKET: {
    EMPTY: 'Basket is Empty',
    ITEM_ADDED: 'Item added to basket',
    CLEARED: 'Basket cleared'
  }
};
```

## Testing Strategy

### Type Safety
- **Compile-Time Checking**: TypeScript compilation validation
- **Interface Compliance**: Strict type checking across components
- **Runtime Validation**: Input validation with type guards

### Development Testing
- **Hot Reload**: Instant feedback during development
- **Error Overlay**: Detailed error information in development mode
- **Console Logging**: Structured logging for debugging

## Deployment Considerations

### Build Optimization
- **Tree Shaking**: Unused code elimination
- **Minification**: JavaScript and CSS minification
- **Asset Optimization**: Image and font optimization
- **Bundle Splitting**: Optimal chunk sizing

### Performance Metrics
- **Core Web Vitals**: Optimized for Google's performance metrics
- **Lighthouse Score**: High performance, accessibility, and SEO scores
- **Bundle Size**: Optimized bundle size for fast loading

### Environment Configuration
- **Development**: Hot reload with detailed error information
- **Production**: Optimized builds with error boundary protection
- **Environment Detection**: Automatic API endpoint selection

## Browser Compatibility

### Modern Browser Support
The application requires modern browser features for optimal functionality:

| Feature | Requirement | Fallback |
|---------|-------------|----------|
| **BarcodeDetector API** | Chrome ≥90, Edge ≥90 | Feature detection with graceful degradation |
| **MediaDevices API** | All modern browsers | Camera access error handling |
| **ImageCapture API** | Chrome ≥59, Edge ≥90 | Frame capture alternatives |
| **Local Storage** | Universal support | Memory-based fallback |

### Feature Detection Implementation
```typescript
useEffect(() => {
  if ("BarcodeDetector" in window) {
    updateStatus("Scanner ready. Tap to start scanning", 'info');
  } else {
    updateStatus("Barcode scanning not supported in this browser", 'error');
  }
}, []);
```

## License

MIT License - Open source project by Intel IoT Club

---

## Related Repositories

- **Backend API**: [smart_grocery_basket_backend](https://github.com/Intel-IoT-Club/smart_grocery_basket_backend)
- **Documentation**: Comprehensive API documentation available in backend repository
}
```

### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_ENVIRONMENT=development
ANALYZE=false
```

### Development Workflow
```bash
# Start development with file watching
npm run dev

# Type checking in separate terminal
npm run type-check -- --watch

# Linting
npm run lint

# Build for production testing
npm run build && npm start
```

## Build and Deployment

### Production Build
```bash
# Create optimized production build
npm run build

# Analyze bundle size
ANALYZE=true npm run build

# Start production server
npm start
```

### Build Configuration
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['via.placeholder.com', 'example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  assetPrefix: process.env.NODE_ENV === 'production' ? '/grocery-app' : '',
};
```

### Performance Monitoring
```typescript
// Web Vitals reporting
export function reportWebVitals(metric: NextWebVitalsMetric) {
  switch (metric.name) {
    case 'CLS':
    case 'FID':
    case 'FCP':
    case 'LCP':
    case 'TTFB':
      console.log(metric);
      // Send to analytics service
      break;
    default:
      break;
  }
}
```

## Testing Strategy

### Unit Testing Framework
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

### Component Testing
```typescript
// components/__tests__/GroceryBasket.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import GroceryBasket from '../GroceryBasket';

describe('GroceryBasket', () => {
  test('renders empty basket state', () => {
    render(<GroceryBasket />);
    expect(screen.getByText('Basket is Empty')).toBeInTheDocument();
  });

  test('adds product to basket', () => {
    const mockProduct = {
      productId: 'P001',
      name: 'Test Product',
      mrpPrice: 100,
      image: 'test.jpg',
      category: 'Test'
    };

    render(<GroceryBasket />);
    // Test product addition logic
  });
});
```

### API Testing
```typescript
// services/__tests__/api.test.ts
import { ProductService } from '../api';

// Mock fetch
global.fetch = jest.fn();

describe('ProductService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('fetches product successfully', async () => {
    const mockProduct = { productId: 'P001', name: 'Test' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockProduct })
    });

    const result = await ProductService.getProduct('P001');
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockProduct);
  });
});
```

### E2E Testing Setup
```bash
# Install Playwright for E2E testing
npm install --save-dev @playwright/test

# Run E2E tests
npx playwright test
```

### Test Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};

module.exports = createJestConfig(customJestConfig);
```

## Browser Support

### Supported Browsers
- Chrome/Chromium ≥90
- Firefox ≥88
- Safari ≥14
- Edge ≥90
- Mobile Safari ≥14
- Chrome Android ≥90

### Progressive Enhancement
```typescript
// Feature detection
const checkBrowserSupport = () => {
  const features = {
    camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    barcodeDetector: 'BarcodeDetector' in window,
    serviceWorker: 'serviceWorker' in navigator,
    notifications: 'Notification' in window
  };
  
  return features;
};
```

### Polyfills and Fallbacks
```typescript
// Barcode detection fallback
const initializeBarcodeScanning = async () => {
  if ('BarcodeDetector' in window) {
    return new BarcodeDetector();
  } else {
    // Fallback to library-based detection
    const { BarcodeDetector } = await import('barcode-detector/pure');
    return new BarcodeDetector();
  }
};
```

## Contributing

### Development Guidelines
1. Follow TypeScript strict mode requirements
2. Use semantic commit messages (feat, fix, docs, style, refactor, test, chore)
3. Ensure all tests pass before submitting PR
4. Update documentation for new features
5. Follow accessibility guidelines (WCAG 2.1 AA)
6. Optimize for performance and bundle size

### Code Quality Standards
```typescript
// ESLint configuration
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react-hooks/exhaustive-deps': 'error'
  }
};
```

### Pull Request Process
1. Create feature branch from main
2. Implement changes with tests
3. Run full test suite and linting
4. Update documentation if needed
5. Submit PR with detailed description
6. Address code review feedback
7. Ensure CI/CD checks pass

### Issue Reporting
- Use provided issue templates
- Include browser information and steps to reproduce
- Attach screenshots for UI issues
- Provide minimal reproduction example

---

## License
MIT License - see LICENSE file for details

## Support
For technical support or questions:
- Create an issue on GitHub
- Review the troubleshooting guide
- Check browser console for error details
- Ensure camera permissions are granted

## Changelog
See CHANGELOG.md for version history and updates
