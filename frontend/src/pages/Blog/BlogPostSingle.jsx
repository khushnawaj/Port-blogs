import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import "./BlogPostSingle.scss";

import api from "../../services/api";
import CommentsSection from "../../components/CommentSection/CommentSection";
import { useAuth } from "../../contexts/AuthContext";
import { FiHeart, FiEye } from "react-icons/fi";

const BlogPostSingle = () => {
  const { id } = useParams();
  const location = useLocation();
  const { currentUser } = useAuth();
  const isPreview = location.state?.preview || false;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);

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

  // Initialize likes when post is loaded
  useEffect(() => {
    if (post) {
      setLikes(post.likes?.length || 0);
      setIsLiked(currentUser && post.likes?.includes(currentUser._id));
    }
  }, [post, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like this post");
      return;
    }

    if (likePending) return;

    setLikePending(true);
    try {
      const { data } = await api.put(`/blog/${id}/like`);
      setLikes(data.data.likes);
      setIsLiked(data.data.isLiked);
    } catch (err) {
      console.error("Failed to like post:", err);
    } finally {
      setLikePending(false);
    }
  };

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

        {/* Stats and Like Button */}
        <div className="blog-post__stats">
          <div className="stats-left">
            <span className="stat-item">
              <FiEye /> {post.views || 0} views
            </span>
            <span className="stat-item">
              <FiHeart /> {likes} likes
            </span>
          </div>
          {!isPreview && (
            <button
              className={`like-btn ${isLiked ? "liked" : ""}`}
              onClick={handleLike}
              disabled={likePending}
            >
              <FiHeart className={isLiked ? "filled" : ""} />
              {isLiked ? "Liked" : "Like"}
            </button>
          )}
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
