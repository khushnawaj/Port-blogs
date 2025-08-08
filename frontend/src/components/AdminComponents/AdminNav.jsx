import { Link } from 'react-router-dom';

const AdminNav = () => {
  return (
    <nav className="admin-nav">
      <Link to="/admin">Dashboard</Link>
      <Link to="/admin/posts">Post Approvals</Link>
      <Link to="/">Back to Site</Link>
    </nav>
  );
};

export default AdminNav;