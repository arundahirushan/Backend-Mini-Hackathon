import apiFetch from './api';

/**
 * POST /api/bookings
 * Create a new booking for the logged-in user.
 */
export async function createBooking(data) {
  return apiFetch('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * GET /api/bookings/mine
 * Get all bookings belonging to the logged-in user.
 */
export async function getMyBookings() {
  return apiFetch('/api/bookings/mine');
}

/**
 * GET /api/bookings/:id
 * Get a single booking by ID (owner or admin).
 */
export async function getBookingById(id) {
  return apiFetch(`/api/bookings/${id}`);
}

/**
 * PUT /api/bookings/:id
 * Update a pending booking (owner only).
 */
export async function updateBooking(id, data) {
  return apiFetch(`/api/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE /api/bookings/:id
 * Soft-cancel a booking (owner only).
 */
export async function cancelBooking(id) {
  return apiFetch(`/api/bookings/${id}`, {
    method: 'DELETE',
  });
}
