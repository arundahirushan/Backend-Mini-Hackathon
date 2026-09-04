const Booking = require("../models/Booking");
const Destination = require("../models/Destination");

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Generate a unique 6-character alphanumeric booking reference.
 */
async function generateBookingRef() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref;
  let exists = true;

  while (exists) {
    ref = Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
    exists = await Booking.exists({ bookingRef: ref });
  }

  return ref;
}

/**
 * Fetch destinations by IDs and calculate cost metrics.
 * @param {string[]} destinationIds
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {number} travelers
 * @returns {{ destinations, totalDays, estimatedTotalCostLKR }}
 */
async function calcCost(destinationIds, startDate, endDate, travelers) {
  const destinations = await Destination.find({ _id: { $in: destinationIds } });

  if (destinations.length !== destinationIds.length) {
    const foundIds = destinations.map((d) => d._id.toString());
    const missing = destinationIds.filter((id) => !foundIds.includes(id.toString()));
    throw Object.assign(new Error("Some destinations were not found."), {
      status: 400,
      missing,
    });
  }

  const totalDays = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );

  const estimatedTotalCostLKR = destinations.reduce((sum, dest) => {
    return (
      sum +
      dest.estimatedDailyCostLKR * totalDays * travelers +
      dest.entryFeeLKR * travelers
    );
  }, 0);

  return { destinations, totalDays, estimatedTotalCostLKR };
}

// ─── Service Functions ───────────────────────────────────────────────────────

/**
 * Create a new booking.
 */
async function createBooking(data, userId) {
  const { touristName, email, phone, startDate, endDate, travelers, destinationIds, notes } = data;

  const { totalDays, estimatedTotalCostLKR } = await calcCost(
    destinationIds,
    startDate,
    endDate,
    travelers
  );

  const bookingRef = await generateBookingRef();

  const booking = await Booking.create({
    userId,
    touristName,
    email,
    phone,
    startDate,
    endDate,
    travelers,
    destinationIds,
    totalDays,
    estimatedTotalCostLKR,
    bookingRef,
    notes: notes || "",
  });

  return booking;
}

/**
 * Get all bookings for a specific user, with destinations populated.
 */
async function getMyBookings(userId) {
  return Booking.find({ userId }).populate(
    "destinationIds",
    "name district estimatedDailyCostLKR entryFeeLKR"
  );
}

/**
 * Get a single booking by ID, with destinations populated.
 */
async function getBookingById(bookingId) {
  return Booking.findById(bookingId).populate(
    "destinationIds",
    "name district estimatedDailyCostLKR entryFeeLKR"
  );
}

/**
 * Update a booking's mutable fields and recalculate cost if needed.
 */
async function updateBooking(bookingId, data) {
  const booking = await Booking.findById(bookingId);
  if (!booking) return null;

  const {
    touristName,
    email,
    phone,
    startDate,
    endDate,
    travelers,
    destinationIds,
    notes,
  } = data;

  // Determine effective values (fall back to existing booking values)
  const effectiveDestIds = destinationIds || booking.destinationIds;
  const effectiveStart = startDate || booking.startDate;
  const effectiveEnd = endDate || booking.endDate;
  const effectiveTravelers = travelers !== undefined ? travelers : booking.travelers;

  // Recalculate only if any pricing field was supplied
  const needsRecalc =
    destinationIds || startDate || endDate || travelers !== undefined;

  if (needsRecalc) {
    const { totalDays, estimatedTotalCostLKR } = await calcCost(
      effectiveDestIds,
      effectiveStart,
      effectiveEnd,
      effectiveTravelers
    );
    booking.totalDays = totalDays;
    booking.estimatedTotalCostLKR = estimatedTotalCostLKR;
    booking.destinationIds = effectiveDestIds;
    booking.startDate = effectiveStart;
    booking.endDate = effectiveEnd;
    booking.travelers = effectiveTravelers;
  }

  if (touristName !== undefined) booking.touristName = touristName;
  if (email !== undefined) booking.email = email;
  if (phone !== undefined) booking.phone = phone;
  if (notes !== undefined) booking.notes = notes;

  await booking.save();
  return booking;
}

/**
 * Soft-cancel a booking by setting status to "Cancelled".
 */
async function cancelBooking(bookingId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) return null;

  booking.status = "Cancelled";
  await booking.save();
  return booking;
}

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
};
