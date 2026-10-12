// Live backend on Render: https://shiftfinanace.onrender.com
const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    const cleanUrl = envUrl.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  // In local development, fall back to /api for Vite proxy if env var is not specified
  if (import.meta.env.DEV) {
    return '/api';
  }
  // Default to live Render backend in production
  return 'https://shiftfinanace.onrender.com/api';
};

const API_BASE = getApiBase();

/**
 * Quick health ping to wake up Render free tier backend
 */
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' });
    return await res.json().catch(() => ({ status: 'online' }));
  } catch (err) {
    console.warn('Backend waking up or health check failed:', err.message);
    return null;
  }
}

/**
 * Fetch wrapper that automatically adds Authorization Bearer token
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('shift_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    // If Render backend is sleeping or network is slow
    const netErr = new Error(
      'Unable to connect to the server. The live backend may be spinning up (please wait a few seconds) or check your connection.'
    );
    netErr.status = 0;
    throw netErr;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Authentication
export const authApi = {
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request('/auth/me'),
  updateChecklist: (key, checked) =>
    request('/auth/checklist', {
      method: 'PUT',
      body: JSON.stringify({ key, checked }),
    }),
};

// Transactions
export const transactionApi = {
  getAll: () => request('/transactions'),
  create: (txData) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(txData),
    }),
  update: (id, txData) =>
    request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(txData),
    }),
  delete: (id) =>
    request(`/transactions/${id}`, {
      method: 'DELETE',
    }),
  loadSample: () =>
    request('/transactions/sample', {
      method: 'POST',
    }),
  clearSample: () =>
    request('/transactions/clear-sample', {
      method: 'POST',
    }),
};

// Savings Goals
export const goalApi = {
  getAll: () => request('/goals'),
  create: (goalData) =>
    request('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    }),
  update: (id, goalData) =>
    request(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    }),
  delete: (id) =>
    request(`/goals/${id}`, {
      method: 'DELETE',
    }),
  addMoney: (id, amount) =>
    request(`/goals/${id}/add`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
  withdrawMoney: (id, amount) =>
    request(`/goals/${id}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
};

// Contact Message
export const contactApi = {
  submit: (formData) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),
};
