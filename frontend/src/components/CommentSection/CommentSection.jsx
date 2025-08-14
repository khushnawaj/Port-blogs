import { useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './CommentSection.scss'

const CommentsSection = ({ postId, comments: initialComments }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.post(`/blog/${postId}/comments`, {
        content: newComment
      });
      setComments([...comments, data.data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>
      
      {currentUser ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
          />
          <button type="submit">Post Comment</button>
        </form>
      ) : (
        <p>Please login to comment</p>
      )}

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment._id} className="comment">
            <div className="comment-author">{comment.author?.username}</div>
            <div className="comment-content">{comment.content}</div>
            <div className="comment-date">
              {new Date(comment.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;