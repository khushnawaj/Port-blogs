// services/blog.js
import api from './api';

export const getPosts = async (params = {}) => {
  const response = await api.get('/blog', { params });
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/blog', postData);
  return response.data;
};

export const approvePost = async (postId) => {
  const response = await api.patch(`/admin/posts/${postId}`, { action: 'approve' });
  return response.data;
};