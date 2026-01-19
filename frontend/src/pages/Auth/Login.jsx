import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        // Check if user has portfolio
        try {
          await api.get("/portfolio/me");
          // If successful (200 OK), user has portfolio -> Go Home
          navigate('/');
        } catch (portfolioErr) {
          // If 404 or error, assume no portfolio -> Go to Builder
          navigate('/portfolio-builder');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      toast.error(msg);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

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
