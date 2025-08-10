// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await getMe();
        setCurrentUser(data);
      } catch (err) {
        setCurrentUser(null);
        console.error(err,'this is error from AuthContext')
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const value = {
    currentUser,
    setCurrentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);