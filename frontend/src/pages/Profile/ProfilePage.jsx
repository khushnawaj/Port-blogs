import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './ProfilePage.scss';

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email
      });
    }
  }, [currentUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/profile', formData);
      setCurrentUser(data.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="profile-info">
          <p><strong>Username:</strong> {currentUser?.username}</p>
          <p><strong>Email:</strong> {currentUser?.email}</p>
          <p><strong>Role:</strong> {currentUser?.role}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;