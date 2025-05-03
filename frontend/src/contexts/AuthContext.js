import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // For demo purposes, we'll use localStorage to persist the user
  // In a real app, you would use a proper authentication service
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function
  async function login(email, password) {
    // This is a mock implementation
    // In a real app, you would call your authentication API
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // For demo, accept any email with password "password"
        if (password === 'password') {
          const user = { email, name: email.split('@')[0] };
          localStorage.setItem('user', JSON.stringify(user));
          setCurrentUser(user);
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  // Register function
  async function register(email, password) {
    // This is a mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { email, name: email.split('@')[0] };
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        resolve(user);
      }, 1000);
    });
  }

  // Logout function
  function logout() {
    localStorage.removeItem('user');
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}