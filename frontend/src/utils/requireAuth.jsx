import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  // In a real app, you would check auth state here
  const isAuthenticated = true; // Temporary - replace with real auth check
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;