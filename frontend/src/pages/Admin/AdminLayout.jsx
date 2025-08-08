import { Outlet } from 'react-router-dom';
import AdminNav from '../../components/AdminComponents/AdminNav';

const AdminLayout = () => {
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