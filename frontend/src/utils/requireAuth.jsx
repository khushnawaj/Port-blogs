// src/utils/requireAuth.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireAuth = ({ children, adminOnly }) => {
  const { currentUser, loading } = useAuth();

  // Wait until auth state is known
  if (loading) {
    return <div />; // or a spinner component
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;
