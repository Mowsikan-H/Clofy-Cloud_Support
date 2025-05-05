// Define API URL from environment variables or fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log('API URL from env:', process.env.REACT_APP_API_URL);
console.log('Using API URL:', API_URL);

// Get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Headers with authorization
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Basic headers without auth
const basicHeaders = () => ({
  'Content-Type': 'application/json'
});

// API methods
export const api = {
  // Auth endpoints
  auth: {
    register: async (userData) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: basicHeaders(),
        body: JSON.stringify(userData)
      });
      return response.json();
    },
    login: async (credentials) => {
      console.log('Login endpoint:', `${API_URL}/auth/login`);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: basicHeaders(),
        body: JSON.stringify(credentials)
      });
      return response.json();
    },
    getProfile: async () => {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: authHeaders()
      });
      return response.json();
    }
  },
  
  // Incidents endpoints
  incidents: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_URL}/incidents?${queryString}`, {
        headers: authHeaders()
      });
      return response.json();
    },
    getById: async (id) => {
      const response = await fetch(`${API_URL}/incidents/${id}`, {
        headers: authHeaders()
      });
      return response.json();
    },
    create: async (incidentData) => {
      const response = await fetch(`${API_URL}/incidents`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(incidentData)
      });
      return response.json();
    },
    update: async (id, incidentData) => {
      const response = await fetch(`${API_URL}/incidents/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(incidentData)
      });
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_URL}/incidents/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      return response.json();
    },
    comments: {
      create: async (commentData) => {
        const response = await fetch(`${API_URL}/incidents/${commentData.incident}/comments`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ content: commentData.content })
        });
        return response.json();
      },
      getByIncident: async (incidentId) => {
        const response = await fetch(`${API_URL}/incidents/${incidentId}/comments`, {
          headers: authHeaders()
        });
        return response.json();
      }
    }
  },
  
  // Knowledge Base endpoints
  knowledgeBase: {
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_URL}/knowledge-base?${queryString}`, {
        headers: authHeaders()
      });
      return response.json();
    },
    getById: async (id) => {
      const response = await fetch(`${API_URL}/knowledge-base/${id}`, {
        headers: authHeaders()
      });
      return response.json();
    },
    create: async (articleData) => {
      const response = await fetch(`${API_URL}/knowledge-base`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(articleData)
      });
      return response.json();
    },
    update: async (id, articleData) => {
      const response = await fetch(`${API_URL}/knowledge-base/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(articleData)
      });
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_URL}/knowledge-base/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      return response.json();
    }
  }
};