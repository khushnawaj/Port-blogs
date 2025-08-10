import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPosts } from '../../services/blog';
import { useAuth } from '../../contexts/AuthContext';
import './BlogList.scss';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();

  // Get query parameters
  const category = searchParams.get('category');
  const author = searchParams.get('author');
  const status = currentUser?.role === 'admin' ? searchParams.get('status') : 'published';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query params
        const params = {};
        if (category) params.category = category;
        if (author) params.author = author;
        if (status) params.status = status;

        const { data } = await getPosts(params);
        setPosts(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load posts');
        console.error('Post fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, author, status, currentUser?.role]);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (posts.length === 0) return <div className="empty">No posts found</div>;

  return (
    <div className="blog-list">
      {/* Filter header */}
      {(category || author) && (
        <h2>
          Posts
          {category && ` in ${category.charAt(0).toUpperCase() + category.slice(1)}`}
          {author && ` by ${author}`}
        </h2>
      )}

      {/* Posts list */}
      {posts.map(post => (
        <article key={post._id} className="post-card">
          <h3>
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            {post.status === 'pending' && <span className="badge pending">Pending</span>}
            {post.status === 'draft' && <span className="badge draft">Draft</span>}
          </h3>
          
          <p className="post-excerpt">{post.excerpt}</p>
          
          <div className="post-meta">
            <span className="author">
              By {post.author?.username || 'Unknown'}
            </span>
            <span className="date">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <div className="tags">
              {post.tags?.map(tag => (
                <Link 
                  key={tag} 
                  to={`/blog?category=${tag.toLowerCase()}`}
                  className="tag"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogList;