import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import CommentsSection from '../../components/CommentSection/CommentSection';

const BlogPostSingle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/blog/${slug}`);
        setPost(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <article className="blog-post">
      <h1>{post.title}</h1>
      <div className="post-meta">
        <span>By {post.author?.username}</span>
        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
      </div>
      
      <div className="post-content">
        {post.content}
      </div>

      <div className="post-tags">
        {post.tags?.map(tag => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>

      <CommentsSection postId={post._id} comments={post.comments} />
    </article>
  );
};

export default BlogPostSingle;