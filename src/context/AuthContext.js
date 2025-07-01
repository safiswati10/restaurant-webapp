import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null,
    userId: null,
    loading: true,
  });

  useEffect(() => {
    const initializeAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const role = localStorage.getItem("userRole");
      const userId = localStorage.getItem("userId");

      if (isLoggedIn && role && userId) {
        setAuthState({
          isAuthenticated: true,
          role,
          userId,
          loading: false,
        });
      } else {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
    window.addEventListener("storage", initializeAuth);
    return () => window.removeEventListener("storage", initializeAuth);
  }, []);

  const login = (userId, role) => {
    setAuthState({
      isAuthenticated: true,
      role,
      userId,
      loading: false,
    });
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", role);
    localStorage.setItem("userId", userId);
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      role: null,
      userId: null,
      loading: false,
    });
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
