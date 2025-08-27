import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './ProfilePage.scss';

// Icons
import { FiEdit, FiTrash2, FiCheck, FiX, FiUpload, FiEye, FiClock, FiFileText } from 'react-icons/fi';

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    bio: '',
    github: '',
    linkedin: '',
    website: ''
  });
  const [editingField, setEditingField] = useState(null);
  const [stats, setStats] = useState({
    solved: 0,
    submissions: 0,
    acceptance: 0,
    posts: 0
  });
  const [userBlogs, setUserBlogs] = useState([]);
  const [activeBlogTab, setActiveBlogTab] = useState('published');
  const [avatarPreview, setAvatarPreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        github: currentUser.github || '',
        linkedin: currentUser.linkedin || '',
        website: currentUser.website || ''
      });
       if (currentUser.profileImage) {
      setAvatarPreview(currentUser.profileImage);
    }
      
      // Set avatar preview if exists
      
      // if (currentUser.profilePicture && currentUser.profilePicture !== 'default.jpg') {
      //   setAvatarPreview(`${process.env.REACT_APP_API_URL}/uploads/${currentUser.profilePicture}`);
      // }

      // Mock stats
      setStats({
        solved: 123,
        submissions: 423,
        acceptance: 82.4,
        posts: 9
      });

      // Fetch user's blogs
      fetchUserBlogs();
    }
  }, [currentUser]);

  const fetchUserBlogs = async () => {
    try {
      const { data } = await api.get('/blog/user/me');
      setUserBlogs(data.data || []);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    }
  };

  const handleUpdate = async (field) => {
    try {
      const { data } = await api.put('/users/profile', { [field]: formData[field] });
      setCurrentUser(data.user);
      setEditingField(null);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await api.delete(`/blogs/${blogId}`);
        setUserBlogs(userBlogs.filter(blog => blog._id !== blogId));
      } catch (err) {
        console.error('Failed to delete blog:', err);
      }
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
    // Upload to server
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const { data } = await api.put(`/users/me/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setCurrentUser(data.user);
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      setAvatarPreview('');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const FieldContainer = ({ label, value, fieldName, isTextarea = false }) => (
    <div className={`field-container ${editingField === fieldName ? 'editing' : ''}`}>
      <div className="field-header">
        <label>{label}</label>
        {editingField !== fieldName && (
          <button 
            className="edit-icon"
            onClick={() => setEditingField(fieldName)}
            aria-label={`Edit ${label}`}
          >
            <FiEdit size={14} />
          </button>
        )}
      </div>
      
      {editingField === fieldName ? (
        <div className="edit-mode">
          {isTextarea ? (
            <textarea
              value={formData[fieldName]}
              onChange={(e) => setFormData({...formData, [fieldName]: e.target.value})}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={formData[fieldName]}
              onChange={(e) => setFormData({...formData, [fieldName]: e.target.value})}
              autoFocus
            />
          )}
          <div className="edit-actions">
            <button className="cancel" onClick={() => setEditingField(null)}>
              <FiX size={14} /> Cancel
            </button>
            <button className="save" onClick={() => handleUpdate(fieldName)}>
              <FiCheck size={14} /> Save
            </button>
          </div>
        </div>
      ) : (
        <div className="field-value">
          {value || <span className="empty">Not specified</span>}
        </div>
      )}
    </div>
  );

  const filteredBlogs = userBlogs.filter(blog => {
    if (activeBlogTab === 'published') return blog.status === 'published';
    if (activeBlogTab === 'pending') return blog.status === 'pending';
    if (activeBlogTab === 'drafts') return blog.status === 'draft';
    return true;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return <FiEye className="icon" />;
      case 'pending': return <FiClock className="icon" />;
      case 'draft': return <FiFileText className="icon" />;
      default: return null;
    }
  };

  return (
    <div className="lc-profile">
      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="user-card">
            <div className="avatar-container">
              <div 
                className="avatar"
                style={{ backgroundImage: avatarPreview ? `url(${avatarPreview})` : '' }}
              >
                {!avatarPreview && currentUser?.username?.charAt(0).toUpperCase()}
              </div>
              <button className="avatar-upload" onClick={triggerFileInput}>
                <FiUpload size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <h2>{currentUser?.username}</h2>
            <div className="user-badge">{currentUser?.role}</div>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.solved}</div>
              <div className="stat-label">Solved</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.submissions}</div>
              <div className="stat-label">Submissions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.acceptance}%</div>
              <div className="stat-label">Acceptance</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.posts}</div>
              <div className="stat-label">Posts</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="profile-content">
          <section className="profile-section">
            <h3>Profile Information</h3>
            <FieldContainer 
              label="Username" 
              value={formData.username} 
              fieldName="username" 
            />
            <FieldContainer 
              label="Name" 
              value={formData.name} 
              fieldName="name" 
            />
            <FieldContainer 
              label="Bio" 
              value={formData.bio} 
              fieldName="bio" 
              isTextarea={true}
            />
          </section>

          <section className="profile-section">
            <h3>Social Links</h3>
            <FieldContainer 
              label="GitHub" 
              value={formData.github} 
              fieldName="github" 
            />
            <FieldContainer 
              label="LinkedIn" 
              value={formData.linkedin} 
              fieldName="linkedin" 
            />
            <FieldContainer 
              label="Website" 
              value={formData.website} 
              fieldName="website" 
            />
          </section>

          <section className="profile-section">
            <div className="section-header">
              <h3>My Blog Posts</h3>
              <div className="blog-tabs">
                <button 
                  className={`tab-btn ${activeBlogTab === 'published' ? 'active' : ''}`}
                  onClick={() => setActiveBlogTab('published')}
                >
                  <FiEye size={14} /> Published
                </button>
                <button 
                  className={`tab-btn ${activeBlogTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveBlogTab('pending')}
                >
                  <FiClock size={14} /> Pending
                </button>
                <button 
                  className={`tab-btn ${activeBlogTab === 'drafts' ? 'active' : ''}`}
                  onClick={() => setActiveBlogTab('drafts')}
                >
                  <FiFileText size={14} /> Drafts
                </button>
              </div>
            </div>

            <div className="blog-list">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map(blog => (
                  <div key={blog._id} className="blog-item">
                    <div className="blog-content">
                      <div className="blog-header">
                        <h4>{blog.title}</h4>
                        <span className={`status-badge ${blog.status}`}>
                          {getStatusIcon(blog.status)}
                          {blog.status}
                        </span>
                      </div>
                      <p className="blog-excerpt">
                        {blog.content.substring(0, 100)}...
                      </p>
                      <div className="blog-meta">
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span>{blog.views} views</span>
                        <span>{blog.likes} likes</span>
                      </div>
                    </div>
                    <div className="blog-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => window.location.href = `/blogs/edit/${blog._id}`}
                      >
                        <FiEdit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteBlog(blog._id)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  No {activeBlogTab} blog posts found
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;