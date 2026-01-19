import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import './CreateBlogPost.scss';

const CreateBlogPost = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    status: currentUser?.role === 'admin' ? 'published' : 'pending'
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/blog', formData);
      toast.success(currentUser?.role === 'admin' ? "Post published!" : "Submitted for review!");
      navigate(currentUser?.role === 'admin' ? '/admin/posts' : '/blog');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2 className="form-title">✍️ Create New Blog Post</h2>

        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter your post title"
              required
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              placeholder="Write your blog content here..."
              required
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-input">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="add-tag-btn"
              >
                Add
              </button>
            </div>

            <div className="tags-list">
              {formData.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="remove-tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {currentUser?.role === 'admin' && (
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Publish Immediately</option>
              </select>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {currentUser?.role === 'admin' ? '🚀 Publish Post' : '📤 Submit for Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlogPost;
