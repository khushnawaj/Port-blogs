import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RequireAuth = ({ children, adminOnly}) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.role !== 'admin') return <Navigate to="/"  />;

  return children;
};

export default RequireAuth;