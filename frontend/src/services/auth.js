import API from './api';

export const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

export const getMe = async () => {
  try {
    const response = await API.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch user' };
  }
};