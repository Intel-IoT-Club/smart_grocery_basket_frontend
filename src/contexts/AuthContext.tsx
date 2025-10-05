'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  sessionId: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // This effect runs once when the app loads
  useEffect(() => {
    const initializeSession = async () => {
      const existingToken = localStorage.getItem('authToken');
      if (existingToken) {
        // If a user token exists, they are logged in.
        // In a real app, you'd validate this token with the backend.
        setAuthToken(existingToken);
      } else {
        // No token, so create a temporary guest session.
        let guestSessionId = sessionStorage.getItem('guestSessionId');
        if (!guestSessionId) {
          // Placeholder for an API call to the backend to get a real session ID
          guestSessionId = `guest_${Date.now()}`; // Simulating a new guest ID
          sessionStorage.setItem('guestSessionId', guestSessionId);
        }
        setSessionId(guestSessionId);
      }
    };

    initializeSession();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    // After login, the permanent session is managed by the auth token.
    // We can clear the temporary guest session ID.
    sessionStorage.removeItem('guestSessionId');
    setSessionId(null); // The backend will now identify the user via the token
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    // When logging out, immediately create a new guest session
    const guestSessionId = `guest_${Date.now()}`;
    sessionStorage.setItem('guestSessionId', guestSessionId);
    setSessionId(guestSessionId);
  };

  const value = {
    // A permanent session is identified by the authToken, a temporary one by the sessionId
    sessionId: authToken ? null : sessionId,
    isLoggedIn: !!authToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};