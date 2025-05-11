import axios from 'axios';

// Base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add auth token to requests if available
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling function
const handleApiError = (error) => {
  console.error('API Error Details:', error);
  
  // Create a standardized error response
  const errorResponse = {
    success: false,
    message: 'An error occurred while connecting to the server'
  };
  
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    errorResponse.message = error.response.data.message || errorResponse.message;
    errorResponse.status = error.response.status;
    errorResponse.data = error.response.data;
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    errorResponse.message = 'No response received from server';
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request setup error:', error.message);
  }
  
  return errorResponse;
};

// Auth API
export const auth = {
  login: async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await axios.get('/api/auth/me');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Knowledge Base API
export const knowledgeBase = {
  getArticles: async () => {
    try {
      const response = await axios.get('/api/knowledge-base/articles');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getArticleById: async (id) => {
    try {
      const response = await axios.get(`/api/knowledge-base/articles/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Incidents API
export const incidents = {
  getAll: async () => {
    try {
      const response = await axios.get('/incidents');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getById: async (id) => {
    try {
      const response = await axios.get(`/incidents/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  create: async (data) => {
    try {
      const response = await axios.post('/incidents', data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  upvote: async (id) => {
    try {
      const response = await axios.post(`/incidents/${id}/upvote`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  vote: async (id, data) => {
    try {
      const response = await axios.post(`/incidents/${id}/vote`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  removeVote: async (id) => {
    try {
      const response = await axios.delete(`/incidents/${id}/vote`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getUserIncidents: async (userId) => {
    try {
      // Remove the duplicate /api prefix since axios is already configured with a base URL
      const response = await axios.get(`/incidents/user/${userId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getComments: async (id) => {
    try {
      const response = await axios.get(`/incidents/${id}/comments`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  addComment: async (id, data) => {
    try {
      const response = await axios.post(`/incidents/${id}/comments`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  addReply: async (id, commentId, data) => {
    try {
      const response = await axios.post(`/incidents/${id}/comments/${commentId}/replies`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Users API
export const users = {
  updateProfile: async (userData) => {
    try {
      const response = await axios.put('/api/auth/profile', userData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  uploadAvatar: async (formData) => {
    try {
      const response = await axios.post('/api/users/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  updatePassword: async (passwordData) => {
    try {
      const response = await axios.put('/api/users/password', passwordData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  deleteAccount: async () => {
    try {
      const response = await axios.delete('/api/users/account');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Export the API object
export const api = {
  auth,
  knowledgeBase,
  incidents,
  users  // This line is already correct in your current file
};

export default api;