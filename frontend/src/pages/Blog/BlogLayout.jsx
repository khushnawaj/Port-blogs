import { Outlet } from 'react-router-dom';

const BlogLayout = () => {
  return (
    <div className="blog-layout">
      <h2>Developer Blog</h2>
      <Outlet /> {/* This renders nested routes */}
    </div>
  );
};

export default BlogLayout;