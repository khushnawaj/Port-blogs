import { Link } from 'react-router-dom';

// Sample blog post data (replace with API call in real app)
const BlogPosts = () => {
  const posts = [
    { id: 1, title: "React Hooks Guide", slug: "react-hooks" },
    { id: 2, title: "MERN Stack Tips", slug: "mern-tips" }
  ];

  return (
    <div className="posts-list">
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <Link to={`/blog/${post.slug}`}>Read More</Link>
        </div>
      ))}
    </div>
  );
};

// Add this line to make it a default export
export default BlogPosts;