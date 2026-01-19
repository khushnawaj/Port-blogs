import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getPosts } from "../../services/blog";
import { useAuth } from "../../contexts/AuthContext";
import "./BlogList.scss";

const BlogList = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // "view" query param: 'my' or 'all'. Default to 'my' if logged in, 'all' otherwise.
  const view = searchParams.get("view") || (currentUser ? "my" : "all");
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

        // If specific author requested, use it.
        // Else if view is 'my' and user logged in, use current user.
        if (author) {
          params.author = author;
        } else if (view === 'my' && currentUser) {
          params.author = currentUser.username;
        }

        const res = await getPosts(params);
        const postsArray = res?.data || [];
        setPosts(postsArray);
      } catch (err) {
        // If 404 (no posts found), just set empty
        if (err.response && err.response.status === 404) {
          setPosts([]);
        } else {
          setError(err.response?.data?.message || "Failed to load posts");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, author, view, currentUser]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getExcerpt = (text, id) => {
    const words = text.split(" ");
    if (words.length <= 20 || expanded[id]) return text;
    return words.slice(0, 20).join(" ") + "...";
  };

  // Toggle View Helper
  const toggleView = () => {
    const newView = view === 'my' ? 'all' : 'my';
    setSearchParams({ view: newView });
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const isMyBlog = view === 'my' && currentUser;

  return (
    <div className="blog-list">
      <div className="blog-header-dynamic">
        <h2>
          {isMyBlog ? "My Blog" : (author ? `Posts by ${author}` : "Community Blog")}
          {category && ` in ${category}`}
        </h2>

        {currentUser && (
          <div className="blog-controls">
            <button onClick={toggleView} className="btn-toggle">
              {isMyBlog ? "View All Posts" : "View My Posts"}
            </button>
            <Link to="/blog/Create-Blog" className="btn-create">Create Post</Link>
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="empty">
          <p>No posts found.</p>
          {isMyBlog && (
            <Link to="/blog/Create-Blog" className="btn-start">Write your first post</Link>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default BlogList;
