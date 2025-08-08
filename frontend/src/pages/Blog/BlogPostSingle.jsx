// src/pages/Blog/BlogPostSingle.jsx
import { useParams } from 'react-router-dom';

// Changed to default export
export default function BlogPostSingle() {
  const { slug } = useParams();
  
  return (
    <div className="blog-post">
      <h2>Blog Post: {slug}</h2>
      {/* Post content would go here */}
    </div>
  );
}