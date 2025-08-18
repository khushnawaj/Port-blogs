import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getPosts } from "../../services/blog";
import "./BlogList.scss";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category");
  const author = searchParams.get("author");

  const handleOpenBlog = (id) => {
    navigate(`/blog/${id}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (category) params.category = category;
        if (author) params.author = author;

        const res = await getPosts(params);
        const postsArray = res?.data || [];
        setPosts(postsArray);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, author]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getExcerpt = (text, id) => {
    const words = text.split(" ");
    if (words.length <= 20 || expanded[id]) return text;
    return words.slice(0, 20).join(" ") + "...";
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (posts.length === 0) return <div className="empty">No posts found</div>;

  return (
    <div className="blog-list">
      {(category || author) && (
        <h2>
          Posts
          {category &&
            ` in ${category.charAt(0).toUpperCase() + category.slice(1)}`}
          {author && ` by ${author}`}
        </h2>
      )}

      <div className="card-grid">
        {posts.map((post) => (
          <article key={post._id} className="post-card">
            <div className="post-header">
              <h3>
                <Link to={`/blog/${post._id}`}>{post.title}</Link>
              </h3>
              {post.status === "pending" && (
                <span className="badge pending">Pending</span>
              )}
              {post.status === "draft" && (
                <span className="badge draft">Draft</span>
              )}
            </div>

            <p className="post-excerpt">
              {getExcerpt(post.content || post.excerpt, post._id)}{" "}
              {post.content?.split(" ").length > 20 && (
                <button
                  className="see-more"
                  onClick={() => handleOpenBlog(post._id)}
                >
                  See more
                </button>
              )}
            </p>

            <div className="post-meta">
              <span className="author">
                By {post.author?.username || "Unknown"}
              </span>
              <span className="date">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <div className="tags">
                {post.tags?.map((tag) => (
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
    </div>
  );
};

export default BlogList;
