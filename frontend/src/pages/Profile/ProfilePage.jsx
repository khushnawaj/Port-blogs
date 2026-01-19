import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { getMyPortfolio } from '../../services/portfolioServices';
import './ProfilePage.scss';
import { FiEdit, FiTrash2, FiCheck, FiX, FiUpload, FiEye, FiClock, FiFileText } from 'react-icons/fi';
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
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
      if (currentUser.profileImage) {
        setAvatarPreview(currentUser.profileImage);
      }

      // Fetch Portfolio
      getMyPortfolio()
        .then(res => setPortfolio(res.data))
        .catch(err => console.log("No portfolio found"));

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

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await api.delete(`/blog/${blogId}`);
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
              <div className="stat-value">{userBlogs.length}</div>
              <div className="stat-label">Posts</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {userBlogs.reduce((acc, blog) => acc + (blog.views || 0), 0)}
              </div>
              <div className="stat-label">Total Views</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {userBlogs.reduce((acc, blog) => acc + (Array.isArray(blog.likes) ? blog.likes.length : 0), 0)}
              </div>
              <div className="stat-label">Total Likes</div>
            </div>
          </div>
        </aside>

        <main className="profile-content">
          <section className="profile-section">
            <div className="section-header">
              <h3>Portfolio Details</h3>
              <Link to="/portfolio-builder" className="btn-edit-portfolio">
                <FiEdit /> Edit Portfolio
              </Link>
            </div>
            {portfolio ? (
              <div className="portfolio-preview">
                <div className="preview-item">
                  <label>Bio</label>
                  <p>{portfolio.about?.bio || "No bio added."}</p>
                </div>
                <div className="preview-item">
                  <label>Skills</label>
                  <p>{portfolio.about?.skills?.join(', ') || "No skills added."}</p>
                </div>
                <div className="preview-item social-links-preview">
                  <label>Socials</label>
                  <div className="links">
                    {portfolio.contact?.github && (
                      <a href={portfolio.contact.github} target="_blank" rel="noreferrer" title="GitHub">
                        <FaGithub size={20} />
                      </a>
                    )}
                    {portfolio.contact?.linkedin && (
                      <a href={portfolio.contact.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">
                        <FaLinkedin size={20} />
                      </a>
                    )}
                    {portfolio.contact?.website && (
                      <a href={portfolio.contact.website} target="_blank" rel="noreferrer" title="Website">
                        <FaGlobe size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-portfolio">
                <p>You haven't created your portfolio yet.</p>
                <Link to="/portfolio-builder" className="btn-create-portfolio">Build Now</Link>
              </div>
            )}
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
                        onClick={() => window.location.href = `/blog/Create-Blog?edit=${blog._id}`}
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