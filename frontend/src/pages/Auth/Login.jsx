import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './Login.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post('/auth/login', formData);

      // Store token and user data
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);

      // Redirect based on role
    navigate(data.user.role === 'admin' ? '/admin' : '/');

    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            autoFocus
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-links">
          <p>
            Don't have an account? <a href="/register">Register here</a>
          </p>
          <p>
            <a href="/forgot-password">Forgot password?</a>
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="demo-hint">
            <p>Admin demo: admin@example.com / admin123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
