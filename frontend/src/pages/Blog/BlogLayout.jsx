import { Outlet, Link } from 'react-router-dom';
import './BlogLayout.scss';

const BlogLayout = () => {
  return (
    <div className="blog-layout">
      <aside className="blog-sidebar">
        <h2>Blog Categories</h2>
        <nav>
          <ul>
            <li><Link to="/blog">All Posts</Link></li>
            <li><Link to="/blog?category=tech">Tech</Link></li>
            <li><Link to="/blog?category=design">Design</Link></li>
          </ul>
        </nav>
      </aside>
      
      <main className="blog-content">
        <Outlet /> {/* This renders nested routes */}
      </main>
    </div>
  );
};

export default BlogLayout;