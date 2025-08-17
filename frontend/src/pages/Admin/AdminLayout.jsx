import { Outlet, Navigate } from 'react-router-dom';
import AdminNav from '../../components/AdminComponents/AdminNav';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { currentUser } = useAuth();

  // Agar user logged in nahi hai ya admin nahi hai → redirect
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminNav />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
