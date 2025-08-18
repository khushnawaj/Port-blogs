import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiFolder, FiBookOpen, FiUser, FiMail } from 'react-icons/fi';
import './Header.scss';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedIcon, setExpandedIcon] = useState(null);
  const [isHoveringUser, setIsHoveringUser] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', name: 'Dashboard', icon: <FiHome /> },
    { path: '/projects', name: 'Projects', icon: <FiFolder /> },
    { path: '/blog', name: 'Blog', icon: <FiBookOpen /> },
    { path: '/about', name: 'About', icon: <FiUser /> },
    { path: '/contact', name: 'Contact', icon: <FiMail /> }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span>Portfolio</span>
        </Link>

        <nav className="header-nav">
          {navLinks.map((link) => (
            <div
              key={link.path}
              className={`nav-icon-wrapper ${
                location.pathname === link.path ? 'active' : ''
              } ${expandedIcon === link.path ? 'expanded' : ''}`}
              onMouseEnter={() => setExpandedIcon(link.path)}
              onMouseLeave={() => setExpandedIcon(null)}
            >
              <Link to={link.path} className="nav-icon">
                {link.icon}
              </Link>
              <span className="nav-label">{link.name}</span>
            </div>
          ))}
        </nav>

        <div className="header-auth-user">
          {!currentUser ? (
            <div className="header-auth">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline">
                Sign Up
              </Link>
            </div>
          ) : (
            <div 
              className="header-user"
              onMouseEnter={() => setIsHoveringUser(true)}
              onMouseLeave={() => setIsHoveringUser(false)}
            >
              <img
                src={currentUser.avatar || '/defaultProfile.jpg'}
                alt="User Avatar"
                className="header-user-avatar"
              />
              <span className="header-username">{currentUser.username}</span>
              <div className={`header-user-dropdown ${isHoveringUser ? 'visible' : ''}`}>
                <Link to="/profile">Profile</Link>
                <Link to="/settings">Settings</Link>
                <button onClick={logout}>Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}