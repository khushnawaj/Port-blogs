import { useState, useEffect } from "react";
import api from "../../services/api";
import "./PostApproval.scss";

const PostApproval = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPendingPosts = async () => {
      try {
        const { data } = await api.get("/admin/posts/pending");
        setPendingPosts(data?.data || []);
      } catch (err) {
        console.error("Failed to fetch pending posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPosts();
  }, []);

  const handleApproval = async (postId, action) => {
    try {
      await api.patch(`/admin/posts/${postId}`, { action });
      setPendingPosts((posts) => posts.filter((post) => post._id !== postId));
      setMessage(
        `Post ${action === "approve" ? "approved" : "rejected"} successfully!`
      );
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      alert(
        `Failed to ${action} post: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  if (loading) return <div className="loading">Loading pending posts...</div>;

  return (
    <div className="post-approval">
      <h2>Pending Approval ({pendingPosts.length})</h2>

      {message && <div className="status-message">{message}</div>}

      {pendingPosts.length === 0 ? (
        <p>No posts pending approval</p>
      ) : (
        <ul className="pending-posts">
          {pendingPosts.map((post) => (
            <li key={post._id} className="pending-post">
              <div className="post-content">
                <h3>{post.title}</h3>
                <p className="author">
                  By: {post.author?.username || "Unknown"}
                </p>
                <div className="post-actions">
                  <button
                    onClick={() => handleApproval(post._id, "approve")}
                    className="approve-btn"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(post._id, "reject")}
                    className="reject-btn"
                  >
                    Reject
                  </button>
                  <a
                    href={`/blog/${post.slug}?preview=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="preview-btn"
                  >
                    Preview
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostApproval;
