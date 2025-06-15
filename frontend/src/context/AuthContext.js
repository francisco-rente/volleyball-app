import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Decode the token to get user information
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser({
            id: decodedToken.id,
            username: decodedToken.username,
            role: decodedToken.role
          });
        }
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username,
      password
    });
    const { token } = response.data;
    localStorage.setItem('token', token);
    
    // Decode token and set user
    const decodedToken = jwtDecode(token);
    setUser({
      id: decodedToken.id,
      username: decodedToken.username,
      role: decodedToken.role
    });
  };

  const register = async (username, email, password) => {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      username,
      email,
      password
    });
    const { token } = response.data;
    localStorage.setItem('token', token);
    
    // Decode token and set user
    const decodedToken = jwtDecode(token);
    setUser({
      id: decodedToken.id,
      username: decodedToken.username,
      role: decodedToken.role
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Add axios interceptor to add token to all requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 