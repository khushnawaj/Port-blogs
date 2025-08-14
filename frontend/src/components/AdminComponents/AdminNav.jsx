import { Link, useLocation } from 'react-router-dom';
import './AdminNav.scss';

const AdminNav = () => {
  const location = useLocation();

  // Check if current route matches nav link
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="admin-nav">
      <div className="admin-nav__container">
        <Link 
          to="/admin" 
          className={`admin-nav__link ${isActive('/admin') ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/admin/posts" 
          className={`admin-nav__link ${isActive('/admin/posts') ? 'active' : ''}`}
        >
          Post Approvals
          <span className="admin-nav__badge">5</span> {/* Dynamic count would go here */}
        </Link>
        <Link 
          to="/" 
          className="admin-nav__link admin-nav__link--exit"
        >
          Back to Site
        </Link>
      </div>
    </nav>
  );
};

export default AdminNav;