import { useState, useEffect } from 'react';
import api from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/users/${userId}`, {
        action: currentStatus === 'active' ? 'deactivate' : 'activate'
      });
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' } 
          : user
      ));
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status || 'active'}</td>
              <td>
                <button 
                  onClick={() => toggleUserStatus(user._id, user.status || 'active')}
                >
                  {user.status === 'inactive' ? 'Activate' : 'Deactivate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;