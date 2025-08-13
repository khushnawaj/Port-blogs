// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // If no token, skip calling /auth/me to avoid 401 loops
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // getMe() returns response.data (the plain user object)
        const user = await getMe();
        setCurrentUser(user);
      } catch (err) {
        console.error('AuthContext loadUser error:', err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
