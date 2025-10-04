// src/contexts/AuthContext.tsx
'use client'; // This is a client-side context

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data
interface AuthContextType {
    isLoggedIn: boolean;
    isGuest: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Here you would check localStorage for an existing token
    const [token, setToken] = useState<string | null>(null);

    const login = (newToken: string) => {
        setToken(newToken);
        // You would also save this token to localStorage
    };

    const logout = () => {
        setToken(null);
        // You would also remove the token from localStorage
    };

    const value = {
        isLoggedIn: !!token,
        isGuest: !token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};