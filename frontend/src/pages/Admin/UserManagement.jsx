import { useState, useEffect } from 'react';
import api from '../../services/api';
import './UserManagement.scss';

// Fallback profile image
import fallbackImg from '../../assets/default.png';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await api.get('/admin/users');
        setUsers(data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Toggle user status
  const toggleUserStatus = async (userId, currentStatus) => {
    setUpdatingUserId(userId);
    setError(null);

    try {
      await api.patch(`/admin/users/${userId}`, {
        action: currentStatus === 'active' ? 'deactivate' : 'activate',
      });

      setUsers(users.map(user =>
        user._id === userId
          ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' }
          : user
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
      console.error(err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {error && <div className="error-message">{error}</div>}

      {users.length === 0 && !error && <div>No users found.</div>}

      <div className="user-cards">
        {users.map(user => (
          <div className="user-card" key={user._id}>
            <img
              src={user.profileImage || fallbackImg}
              alt={user.username}
              className="profile-img"
            />
            <h3>{user.username}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Status:</strong> {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}</p>
            <button
              onClick={() => toggleUserStatus(user._id, user.status || 'active')}
              disabled={updatingUserId === user._id}
              className={user.status === 'inactive' ? 'activate-btn' : 'deactivate-btn'}
            >
              {updatingUserId === user._id
                ? 'Updating...'
                : user.status === 'inactive'
                  ? 'Activate'
                  : 'Deactivate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
