// // src/contexts/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from 'react';
// import { getMe } from '../services/auth';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         // If no token, skip calling /auth/me to avoid 401 loops
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setLoading(false);
//           return;
//         }

//         // getMe() returns response.data (the plain user object)
//         const user = await getMe();
//         setCurrentUser(user);
//       } catch (err) {
//         console.error('AuthContext loadUser error:', err);
//         setCurrentUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   const value = {
//     currentUser,
//     setCurrentUser,
//     loading,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/auth'; // API call to /auth/me
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // fetch current user
        const user = await getMe();
        setCurrentUser(user);
      } catch (err) {
        console.error('AuthContext loadUser error:', err);
        setCurrentUser(null);
        localStorage.removeItem('token'); // cleanup invalid token
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔹 Login (store token + set user manually if API returns it)
  const login = (token, user) => {
    localStorage.setItem('token', token);
    setCurrentUser(user || null);
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login'); // redirect to login page
  };

  const value = {
    currentUser,
    setCurrentUser,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// custom hook for consuming context
export const useAuth = () => useContext(AuthContext);
