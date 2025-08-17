import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './AdminDashboard.scss';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    publishedPosts: 0,
    pendingPosts: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        if (data.success) {
          setStats(data.data); // backend se directly set karenge
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Published Posts</h3>
          <p>{stats.publishedPosts}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <p>{stats.pendingPosts}</p>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/manage-posts" className="admin-button">
          Manage Posts
        </Link>
        <Link to="/admin/manage-users" className="admin-button">
          Manage Users
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
