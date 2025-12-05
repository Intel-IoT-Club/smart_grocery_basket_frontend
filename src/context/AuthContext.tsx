'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCredentials, SignupData, User, AuthState } from '@/types/auth';
import * as authService from '@/services/auth';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: Omit<SignupData, 'confirmPassword'>) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = () => {
            const token = authService.getToken();
            if (token) {
                // In a real app, we would validate the token with the backend here
                // For now, we'll decode it or just assume it's valid if present
                // and try to get user details if stored, or fetch them
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials);
            if (response.success && response.data) {
                const { token, ...userData } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);

                // Redirect based on role
                if (userData.role === 'owner') {
                    router.push('/dashboard');
                } else {
                    router.push('/');
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (data: Omit<SignupData, 'confirmPassword'>) => {
        try {
            const response = await authService.register(data);
            if (response.success && response.data) {
                const { token, ...userData } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);

                if (userData.role === 'owner') {
                    router.push('/dashboard');
                } else {
                    router.push('/');
                }
            }
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
