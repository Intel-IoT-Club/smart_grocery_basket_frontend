# Smart Grocery Basket - Frontend

Progressive Web Application for barcode scanning grocery shopping built with Next.js 15 and React 18.

## Technology Stack
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.6.3
- **Styling**: TailwindCSS 4.0.0
- **Animations**: Framer Motion 11.15.0
- **Icons**: Phosphor Icons React 2.1.7

## Features
- Real-time barcode/QR code scanning
- Shopping basket management
- Responsive design
- Progressive Web App capabilities
- Accessibility support

## Project Structure
```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
├── components/
│   ├── GroceryBasket.tsx    # Shopping basket
│   └── QRScanner.tsx        # Barcode scanner
├── services/
│   └── api.ts               # API client
├── types/
│   └── index.ts             # TypeScript types
└── utils/
    └── index.ts             # Utility functions
```

## Components

### QRScanner
- Camera access and barcode detection
- Product lookup via API
- Error handling and user feedback

### GroceryBasket
- Add/remove products
- Quantity management
- Price calculations
- Animated interactions

## Development Setup

### Prerequisites
- Node.js ≥18.0.0
- Modern browser with camera support

### Installation
```bash
# Clone repository
git clone https://github.com/Intel-IoT-Club/smart_grocery_frontend.git
cd smart_grocery_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Lint code
```

## Browser Support
- Chrome/Chromium ≥90
- Firefox ≥88
- Safari ≥14
- Edge ≥90

Note: Barcode detection requires modern browser support for the BarcodeDetector API.

## License
MIT License

### Development Scripts
```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "lint:fix": "next lint --fix",
  "type-check": "tsc --noEmit",
  "analyze": "ANALYZE=true npm run build",
  "clean": "rm -rf .next out node_modules/.cache"
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
