import apiFetch from './api';

/**
 * GET /api/destinations?district=&category=
 * Public — no auth required.
 */
export async function getAllDestinations({ district, category } = {}) {
  const params = new URLSearchParams();
  if (district) params.append('district', district);
  if (category) params.append('category', category);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/api/destinations${query}`);
}

/**
 * GET /api/destinations/:id
 * Public — no auth required.
 */
export async function getDestinationById(id) {
  return apiFetch(`/api/destinations/${id}`);
}

/**
 * POST /api/destinations
 * Admin only.
 */
export async function createDestination(data) {
  return apiFetch('/api/destinations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT /api/destinations/:id
 * Admin only.
 */
export async function updateDestination(id, data) {
  return apiFetch(`/api/destinations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE /api/destinations/:id
 * Admin only.
 */
export async function deleteDestination(id) {
  return apiFetch(`/api/destinations/${id}`, {
    method: 'DELETE',
  });
}
