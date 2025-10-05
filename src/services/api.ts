/**
 * API service layer for the Smart Grocery Basket application
 * Handles all HTTP requests to the backend API
 */

import { Product, ApiResponse } from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';
import { BasketItem } from '../types';

/**
 * HTTP methods enum
 */
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * API response wrapper interface
 */
interface ApiError extends Error {
  status?: number;
  code?: string;
}

/**
 * Base API client class
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  /**
   * Create a timeout promise
   */
  private createTimeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(ERROR_MESSAGES.NETWORK.TIMEOUT)), ms);
    });
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt = 1
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Log the request details in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      console.log(`Attempt: ${attempt}/${this.retryAttempts}`);
    }

    const token = localStorage.getItem('authToken'); // Get token from localStorage

    try {
      // Create the fetch promise
      const fetchPromise = fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
      });

      // Race between fetch and timeout
      const response = await Promise.race([
        fetchPromise,
        this.createTimeoutPromise(this.timeout)
      ]);

      // Log response details in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`API Response: ${response.status} ${response.statusText}`);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = new Error(
          errorData.error || errorData.message || `HTTP ${response.status}`
        );
        error.status = response.status;
        throw error;
      }

      // Parse JSON response
      const data = await response.json();
      return data;

    } catch (error) {
      console.error(`API Request failed (attempt ${attempt}/${this.retryAttempts}):`, {
        url,
        method: options.method || 'GET',
        error: error instanceof Error ? error.message : String(error)
      });

      // Retry on network errors (not 4xx errors)
      const shouldRetry = attempt < this.retryAttempts && (
        !(error instanceof Error && 'status' in error) ||
        typeof (error as ApiError).status !== 'number' ||
        (error as ApiError).status! >= 500
      );

      if (shouldRetry) {
        await this.sleep(this.retryDelay * attempt);
        return this.makeRequest<T>(endpoint, options, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.makeRequest<T>(url, {
      method: HttpMethod.GET,
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: HttpMethod.POST,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: HttpMethod.PUT,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: HttpMethod.DELETE,
    });
  }
}

// Add this class inside services/api.ts
class AuthService extends ApiClient {
  async createGuestSession(): Promise<{ sessionId: string }> {
    // This endpoint needs to be created on your backend
    return this.post<{ sessionId: string }>('/api/sessions/guest');
  }
  async login(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    return this.post('/api/auth/login', { email, password });
  }
  async register(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    return this.post('/api/auth/register', { email, password });
  }
}

export const authService = new AuthService();

class CartService extends ApiClient {
  private readonly endpoint = '/api/cart';

  /**
   * Get the current user's cart
   */
  async getCart(sessionId: string): Promise<ApiResponse<BasketItem[]>> {
    try {
      return await this.get<ApiResponse<BasketItem[]>>(`${this.endpoint}/${sessionId}`);
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Add an item to the cart
   */
  async addToCart(sessionId: string, item: { productId: string; quantity: number }): Promise<ApiResponse<BasketItem>> {
    try {
      return await this.post<ApiResponse<BasketItem>>(`${this.endpoint}/${sessionId}/items`, item);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remove a product from the cart
   */
  async removeFromCart(sessionId: string, productId: string): Promise<ApiResponse<void>> {
    try {
      if (!productId) {
        throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_PRODUCT_ID);
      }
      return await this.delete<ApiResponse<void>>(
        `${this.endpoint}/${sessionId}/items/${encodeURIComponent(productId)}`
      );
    } catch (error) {
      console.error(`Error removing item ${productId} from cart:`, error);
      throw this.handleError(error);
    }
  }
  
  /**
   * Update the quantity of an item in the cart
   */
  async updateItemQuantity(sessionId: string, productId: string, quantity: number): Promise<ApiResponse<BasketItem>> {
    try {
      if (!productId) {
        throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_PRODUCT_ID);
      }
      return await this.put<ApiResponse<BasketItem>>(
        `${this.endpoint}/${sessionId}/items/${encodeURIComponent(productId)}`,
        { quantity }
      );
    } catch (error) {
      console.error(`Error updating quantity for item ${productId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Clear all items from the cart
   */
  async clearCart(sessionId: string): Promise<ApiResponse<void>> {
    try {
      // This endpoint would delete all items associated with the session
      return await this.delete<ApiResponse<void>>(`${this.endpoint}/${sessionId}/items`);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle and transform errors
   */
  private handleError(error: any): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error(ERROR_MESSAGES.NETWORK.SERVER_ERROR);
  }
}
export const cartService = new CartService();

/**
 * Product API service
 */
class ProductService extends ApiClient {
  private readonly endpoint = '/api/products';

  /**
   * Get all products with optional filtering
   */
  async getProducts(params?: {
    category?: string;
    inStock?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Product[]>> {
    try {
      return await this.get<ApiResponse<Product[]>>(this.endpoint, params);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get a single product by ID
   */
  async getProductById(productId: string): Promise<ApiResponse<Product>> {
    try {
      if (!productId || typeof productId !== 'string') {
        throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_PRODUCT_ID);
      }

      return await this.get<ApiResponse<Product>>(`${this.endpoint}/${encodeURIComponent(productId)}`);
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new product
   */
  async createProduct(productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    try {
      this.validateProductData(productData);
      return await this.post<ApiResponse<Product>>(this.endpoint, productData);
    } catch (error) {
      console.error('Error creating product:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(productId: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      if (!productId) {
        throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_PRODUCT_ID);
      }

      return await this.put<ApiResponse<Product>>(
        `${this.endpoint}/${encodeURIComponent(productId)}`,
        productData
      );
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: string): Promise<ApiResponse<void>> {
    try {
      if (!productId) {
        throw new Error(ERROR_MESSAGES.VALIDATION.INVALID_PRODUCT_ID);
      }

      return await this.delete<ApiResponse<void>>(`${this.endpoint}/${encodeURIComponent(productId)}`);
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * Search products by barcode or product ID
   */
  async searchByBarcode(barcode: string): Promise<Product | null> {
    try {
      if (!barcode || typeof barcode !== 'string') {
        throw new Error('Invalid barcode');
      }

      // First, try to get the product by ID (assuming barcode is product ID)
      const response = await this.getProductById(barcode);
      return response.data || null;
    } catch (error) {
      // If product not found, try searching in all products
      try {
        const response = await this.getProducts({ search: barcode });
        const products = response.data || [];
        
        // Look for exact match first
        const exactMatch = products.find(p => p.productId === barcode);
        if (exactMatch) return exactMatch;

        // If no exact match, return first result
        return products.length > 0 ? products[0] : null;
      } catch (searchError) {
        console.error('Error searching products by barcode:', searchError);
        return null;
      }
    }
  }

  /**
   * Validate product data
   */
  private validateProductData(productData: any): void {
    const required = ['productId', 'name', 'mrpPrice', 'stock'];
    const missing = required.filter(field => 
      productData[field] === undefined || 
      productData[field] === null || 
      productData[field] === ''
    );

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (typeof productData.mrpPrice !== 'number' || productData.mrpPrice < 0) {
      throw new Error('Price must be a positive number');
    }

    if (typeof productData.stock !== 'number' || productData.stock < 0) {
      throw new Error('Stock must be a non-negative number');
    }
  }

  /**
   * Handle and transform errors
   */
  private handleError(error: any): ApiError {
    if (error instanceof Error) {
      return error as ApiError;
    }

    return new Error(ERROR_MESSAGES.NETWORK.SERVER_ERROR) as ApiError;
  }
}

/**
 * Health check service
 */
class HealthService extends ApiClient {
  /**
   * Check API health status
   */
  async checkHealth(): Promise<{
    status: string;
    timestamp: string;
    service: string;
    version: string;
  }> {
    try {
      return await this.get<{
        status: string;
        timestamp: string;
        service: string;
        version: string;
      }>('/health');
    } catch (error) {
      console.error('Health check failed:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (error instanceof Error) {
      return error as ApiError;
    }
    return new Error('Health check failed') as ApiError;
  }
}

// Export service instances
export const productService = new ProductService();
export const healthService = new HealthService();

// Export classes for testing
export { ProductService, HealthService, ApiClient };

// Debug utility function to test API connectivity
export const testApiConnection = async () => {
  console.log('Testing API Connection...');
  console.log('Base URL:', API_CONFIG.BASE_URL);
  
  try {
    const response = await healthService.checkHealth();
    console.log('✅ API Connection successful:', response);
    return true;
  } catch (error) {
    console.error('❌ API Connection failed:', error);
    
    // Additional debugging
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        console.error('This is likely a CORS issue. Check backend CORS configuration.');
      } else if (error.message.includes('timeout')) {
        console.error('Request timed out. Check backend availability.');
      } else if (error.message.includes('Network')) {
        console.error('Network error. Check internet connection.');
      }
    }
    
    return false;
  }
};
