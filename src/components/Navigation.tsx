'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const { user, isAuthenticated, logout } = useAuth();
    const pathname = usePathname();

    // Don't show navigation on login/signup pages to keep them clean
    if (pathname === '/login' || pathname === '/signup') {
        return null;
    }

    return (
        <nav className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-white font-bold text-lg">
                            Smart Grocery
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-300 text-sm">
                                    Welcome, {user?.username}
                                </span>
                                {user?.role === 'owner' && (
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
