const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Base fetch wrapper.
 * Automatically reads the JWT token from localStorage and adds
 * the Authorization: Bearer <token> header on every request.
 */
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export default apiFetch;
