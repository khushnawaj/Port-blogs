import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./BlogPostSingle.scss";

import api from "../../services/api";
import CommentsSection from "../../components/CommentSection/CommentSection";

const BlogPostSingle = () => {
  const { id } = useParams();
  const location = useLocation();
  const isPreview = location.state?.preview || false;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const endpoint = isPreview
          ? `/admin/posts/${id}` // 🔒 secure preview (needs token)
          : `/blog/${id}`;       // 🌍 public view

        const { data } = await api.get(endpoint);
        setPost(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, isPreview]);

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <article className="blog-post">
      <header className="blog-post__header">
        <h1>{post.title}</h1>
        <div className="blog-post__meta">
          <span>✍️ {post.author?.username || "Unknown"}</span>
          <span>
            📅 {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
          </span>
          {isPreview && <span className="badge preview">Preview Mode</span>}
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

      {!isPreview && (
        <CommentsSection postId={post._id} comments={post.comments} />
      )}
    </article>
  );
};

export default BlogPostSingle;
