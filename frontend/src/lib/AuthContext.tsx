"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      const storedUser = localStorage.getItem("ai_recruiter_user");
      const hasCookie = document.cookie.includes("auth_token=true");
      
      if (storedUser && hasCookie) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    // Mock login logic
    const mockUser = {
      name: email.split("@")[0] || "User",
      email,
      role: "Recruiter"
    };
    
    // Set cookie for middleware
    document.cookie = "auth_token=true; path=/; max-age=86400"; // 1 day
    
    // Set localStorage for client state
    localStorage.setItem("ai_recruiter_user", JSON.stringify(mockUser));
    
    setUser(mockUser);
    setIsAuthenticated(true);
    
    // The middleware handles redirecting, but let's go to dashboard by default
    // or respect a callbackUrl if we implement one on the login page.
  };

  const logout = () => {
    // Clear cookies
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Clear localStorage
    localStorage.removeItem("ai_recruiter_user");
    
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
