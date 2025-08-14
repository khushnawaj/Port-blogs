// // src/utils/requireAuth.jsx
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const RequireAuth = ({ children, adminOnly }) => {
//   const { currentUser, loading } = useAuth();

//   // Wait until auth state is known
//   if (loading) {
//     return <div />; // or a spinner component
//   }

//   if (!currentUser) {
//     return <Navigate to="/login" replace />;
//   }

//   if (adminOnly && currentUser.role !== 'admin') {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default RequireAuth;

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireAuth = ({ children, adminOnly = false }) => {
  const { currentUser, loading } = useAuth();

  // Show a simple loading state (could be a spinner component)
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        fontWeight: '500'
      }}>
        Checking authentication...
      </div>
    );
  }

  // If not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If admin-only route and user is not admin
  if (adminOnly && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Authorized: render children
  return children;
};

export default RequireAuth;
