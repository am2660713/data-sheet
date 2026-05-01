const API_BASE = 'http://localhost:3001/api';

// Helper for API calls
async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Projects API
export const projectAPI = {
  async getAll(email) {
    return fetchAPI(`${API_BASE}/projects/${encodeURIComponent(email)}`);
  },

  async add(project, email) {
    return fetchAPI(`${API_BASE}/projects`, {
      method: 'POST',
      body: JSON.stringify({ project, userEmail: email }),
    });
  },

  async update(id, project) {
    return fetchAPI(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ project }),
    });
  },

  async delete(id) {
    return fetchAPI(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// Daily timesheet API
export const dailyAPI = {
  async getAll(email) {
    return fetchAPI(`${API_BASE}/daily/${encodeURIComponent(email)}`);
  },

  async add(entry, email) {
    return fetchAPI(`${API_BASE}/daily`, {
      method: 'POST',
      body: JSON.stringify({ entry, userEmail: email }),
    });
  },

  async update(id, entry) {
    return fetchAPI(`${API_BASE}/daily/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ entry }),
    });
  },

  async delete(id) {
    return fetchAPI(`${API_BASE}/daily/${id}`, {
      method: 'DELETE',
    });
  },
};

// Monthly summary API
export const monthlyAPI = {
  async getAll(email) {
    return fetchAPI(`${API_BASE}/monthly/${encodeURIComponent(email)}`);
  },

  async save(monthly, email) {
    return fetchAPI(`${API_BASE}/monthly`, {
      method: 'POST',
      body: JSON.stringify({ monthly, userEmail: email }),
    });
  },
};

// User API
export const userAPI = {
  async getOrCreate(email, name) {
    return fetchAPI(`${API_BASE}/user`, {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  },

  async get(email) {
    return fetchAPI(`${API_BASE}/user/${encodeURIComponent(email)}`);
  },
};

export default {
  projectAPI,
  dailyAPI,
  monthlyAPI,
  userAPI,
};
