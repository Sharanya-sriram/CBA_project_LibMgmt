import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/http-common";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [loading, setLoading] = useState(true);
  const fetchCurrentUser = async () => {
    try {
      const response = await api.getCurrentUser();
      setUser(response.data.user || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  // Check current user on mount (session persistence)
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const login = async (username, password) => {
    try {
      const response = await api.loginUser({ username, password });
      if (response.data.user) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (data) => {
    try {
      const response = await api.registerUser(data);
      if (response.data.userId) {
        // auto-login after registration
        await fetchCurrentUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
  };

  const isAdmin = () => user?.role === "admin";
  const isUser = () => user?.role === "user";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        darkMode,
        toggleDarkMode,
        loading,
        isAdmin,
        isUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
