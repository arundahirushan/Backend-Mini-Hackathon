import apiFetch from './api';

/**
 * POST /api/auth/register
 * @param {{ fullName: string, email: string, password: string }} data
 */
export async function register(data) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * POST /api/auth/login
 * Returns { token, user: { _id, fullName, email, role } }
 * @param {{ email: string, password: string }} data
 */
export async function login(data) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
