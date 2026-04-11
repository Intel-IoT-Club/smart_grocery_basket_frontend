'use client';

import { FC, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/api';
import { Product } from '@/types';

const OwnerDashboard: FC = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        } else if (!isLoading && user?.role !== 'owner') {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, user, router]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (user?.role === 'owner') {
                try {
                    const response = await productService.getProducts();
                    if (response.success && response.data) {
                        setProducts(response.data);
                    }
                } catch (error) {
                    console.error('Failed to fetch products:', error);
                } finally {
                    setLoadingProducts(false);
                }
            }
        };

        fetchProducts();
    }, [user]);

    if (isLoading || loadingProducts) {
        return <div className="p-4 text-center text-white">Loading...</div>;
    }

    if (!user || user.role !== 'owner') {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-white mb-6">Owner Dashboard</h1>

            <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-white">Product Inventory</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-400">Manage your store inventory</p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Add Product
                    </button>
                </div>
                <div className="border-t border-gray-700">
                    <ul role="list" className="divide-y divide-gray-700">
                        {products.map((product) => (
                            <li key={product.productId} className="px-4 py-4 sm:px-6 hover:bg-gray-750">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.image || 'https://via.placeholder.com/40'} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-indigo-400">{product.name}</div>
                                            <div className="text-sm text-gray-400">ID: {product.productId}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-sm text-white">Stock: {product.stock}</div>
                                        <div className="text-sm text-gray-400">Price: ₹{product.mrpPrice}</div>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {products.length === 0 && (
                            <li className="px-4 py-8 text-center text-gray-400">No products found.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
