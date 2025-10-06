'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the user object and the context
interface User {
  id: string;
  email: string;
  name?: string;
  // Add any other user properties you need
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
