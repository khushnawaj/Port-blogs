import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./BlogPostSingle.scss";

import api from "../../services/api";
import CommentsSection from "../../components/CommentSection/CommentSection";

const BlogPostSingle = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/blog/${id}`);
        setPost(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <article className="blog-post">
      <header className="blog-post__header">
        <h1>{post.title}</h1>
        <div className="blog-post__meta">
          <span>✍️ {post.author?.username || "Unknown"}</span>
          <span>📅 {new Date(post.publishedAt).toLocaleDateString()}</span>
        </div>
      </header>

      <section
        className="blog-post__content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags?.length > 0 && (
        <footer className="blog-post__tags">
          {post.tags.map((tag) => (
            <Link key={tag} to={`/blog?category=${tag}`} className="tag">
              #{tag}
            </Link>
          ))}
        </footer>
      )}

      <CommentsSection postId={post._id} comments={post.comments} />
    </article>
  );
};

export default BlogPostSingle;
