import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiSearch, FiEdit, FiHome, FiUser, FiBookmark } from 'react-icons/fi';
import './BlogLayout.scss';

const BlogLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="blog-layout">
      {/* Header */}
      <header className="blog-header">
        <div className="container">
          <Link to="/" className="brand">
            MyDevBlog
          </Link>
          
          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FiSearch />
            </button>
          </form>

          <nav className="main-nav">
            <Link to="/blog/Create-Blog" className="nav-link">
              <FiEdit /> Write
            </Link>
            <Link to="/blog" className="nav-link">
              <FiHome /> Home
            </Link>
            <Link to="/profile" className="nav-link">
              <FiUser /> Profile
            </Link>
            <Link to="/blog/saved" className="nav-link">
              <FiBookmark /> Saved
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="blog-main">
        <div className="container">
          <Outlet /> {/* This renders nested routes */}
        </div>
      </main>

      {/* Sidebar */}
      <aside className="blog-sidebar">
        <div className="sidebar-section">
          <h3>Categories</h3>
          <ul>
            <li><Link to="/blog?category=react">React</Link></li>
            <li><Link to="/blog?category=javascript">JavaScript</Link></li>
            <li><Link to="/blog?category=node">Node.js</Link></li>
            <li><Link to="/blog?category=css">CSS</Link></li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>Popular Tags</h3>
          <div className="tags">
            <Link to="/blog?tag=webdev" className="tag">#webdev</Link>
            <Link to="/blog?tag=beginners" className="tag">#beginners</Link>
            <Link to="/blog?tag=tutorial" className="tag">#tutorial</Link>
            <Link to="/blog?tag=performance" className="tag">#performance</Link>
          </div>
        </div>
      </aside>

      {/* Footer */}
      {/* <footer className="blog-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} MyDevBlog. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default BlogLayout;