import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const fetchPosts = async ({ tag, page = 1 }) => {
  const params = { page };
  if (tag) params.tag = tag;
  const response = await apiClient.get('/posts', { params });
  return response.data;
};

export const fetchPostById = async (id) => {
  const response = await apiClient.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await apiClient.post('/posts', postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;
