import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true,
});

export const getMatchPercentage = (requiredSkills = [], candidateSkills = []) => {
  const required = [...new Set(requiredSkills.map((skill) => skill.toLowerCase()))];
  const candidate = new Set(candidateSkills.map((skill) => skill.toLowerCase()));

  const matches = required.filter((skill) => candidate.has(skill)).length;
  const total = required.length || 1;

  return Math.round((matches / total) * 100);
};

export const apiService = {
  auth: {
    login: (payload) => api.post('/auth/login', payload),
    register: (payload) => api.post('/auth/register', payload),
    me: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
  },
  users: {
    getAll: () => api.get('/users'),
    search: (params) => api.get('/users/search', { params }),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, payload) => api.put(`/users/${id}`, payload),
    delete: (id) => api.delete(`/users/${id}`),
  },
  skills: {
    getAll: () => api.get('/skills'),
    create: (payload) => api.post('/skills', payload),
    addToUser: (userId, skillId) => api.post(`/users/${userId}/skills`, { skillId }),
    removeFromUser: (userId, skillId) => api.delete(`/users/${userId}/skills/${skillId}`),
  },
  projects: {
    getAll: (params) => api.get('/projects', { params }),
    getById: (id) => api.get(`/projects/${id}`),
    create: (payload) => api.post('/projects', payload),
    update: (id, payload) => api.put(`/projects/${id}`, payload),
    delete: (id) => api.delete(`/projects/${id}`),
    matches: (projectId) => api.get(`/projects/${projectId}/matches`),
  },
  teamRequests: {
    create: (payload) => api.post('/team-requests', payload),
    received: (userId) => api.get('/team-requests/received', { params: { userId } }),
    sent: (userId) => api.get('/team-requests/sent', { params: { userId } }),
    accept: (id) => api.put(`/team-requests/${id}/accept`),
    reject: (id) => api.put(`/team-requests/${id}/reject`),
  },
  admin: {
    stats: () => api.get('/admin/stats'),
    students: () => api.get('/admin/students'),
    projects: () => api.get('/admin/projects'),
    teamRequests: () => api.get('/admin/team-requests'),
  },
};

export default api;
