'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { productService } from '@/services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  // This effect fetches products from your backend API.
  // It includes a debounce to prevent firing an API call on every single keystroke.
  useEffect(() => {
    const timerId = setTimeout(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          // The search query is passed to the backend, which handles the filtering.
          const response = await productService.getProducts({ search: searchQuery });
          if (response.data) {
            setProducts(response.data);
          }
        } catch (error) {
          console.error("Failed to fetch products:", error);
          // Optionally, set an error state here to show a message to the user.
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }, 300); // 300ms delay after user stops typing

    // Cleanup function to clear the timeout if the component unmounts or query changes.
    return () => clearTimeout(timerId);
  }, [searchQuery]); // This effect re-runs whenever the searchQuery state changes.

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6 lg:p-8">
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-white">Our Products</h1>
        <p className="text-gray-400 mt-2">Find everything you need for your pantry.</p>
        <div className="relative mt-6">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </header>
      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-400">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product.productId} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-105">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  <p className="text-sm text-gray-400">{product.category}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xl font-bold text-green-400">₹{product.mrpPrice}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}