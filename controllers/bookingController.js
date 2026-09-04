const bookingService = require("../services/bookingService");

// ─── POST /api/bookings ──────────────────────────────────────────────────────
async function createBooking(req, res) {
  try {
    const {
      touristName,
      email,
      phone,
      startDate,
      endDate,
      travelers,
      destinationIds,
      notes,
    } = req.body;

    // Block fields that must never come from client
    const forbidden = ["totalDays", "estimatedTotalCostLKR", "bookingRef", "status", "userId"];
    for (const field of forbidden) {
      if (req.body[field] !== undefined) {
        return res.status(400).json({ error: `Field '${field}' is not allowed in the request body.` });
      }
    }

    // Required field checks
    if (!touristName || !email || !phone || !startDate || !endDate || !travelers || !destinationIds) {
      return res.status(400).json({ error: "touristName, email, phone, startDate, endDate, travelers, and destinationIds are all required." });
    }

    if (!Array.isArray(destinationIds) || destinationIds.length < 1) {
      return res.status(400).json({ error: "destinationIds must be a non-empty array." });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ error: "endDate must be after startDate." });
    }

    if (Number(travelers) < 1) {
      return res.status(400).json({ error: "travelers must be at least 1." });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "phone must be exactly 10 digits." });
    }

    const booking = await bookingService.createBooking(
      { touristName, email, phone, startDate, endDate, travelers: Number(travelers), destinationIds, notes },
      req.user.id
    );

    return res.status(201).json(booking);
  } catch (err) {
    console.error("createBooking error:", err);
    if (err.status === 400) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// ─── GET /api/bookings/mine ──────────────────────────────────────────────────
async function getMyBookings(req, res) {
  try {
    const bookings = await bookingService.getMyBookings(req.user.id);
    return res.status(200).json(bookings);
  } catch (err) {
    console.error("getMyBookings error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// ─── GET /api/bookings/:id ───────────────────────────────────────────────────
async function getBookingById(req, res) {
  try {
    const booking = await bookingService.getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    const isOwner = booking.userId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "You are not allowed to view this booking." });
    }

    return res.status(200).json(booking);
  } catch (err) {
    console.error("getBookingById error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// ─── PUT /api/bookings/:id ───────────────────────────────────────────────────
async function updateBooking(req, res) {
  try {
    const existing = await bookingService.getBookingById(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: "Booking not found." });
    }

    if (existing.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only edit your own bookings." });
    }

    if (existing.status !== "Pending") {
      return res.status(400).json({ error: "Only Pending bookings can be edited." });
    }

    // Block server-only fields from being updated via client
    const forbidden = ["totalDays", "estimatedTotalCostLKR", "bookingRef", "status", "userId"];
    for (const field of forbidden) {
      if (req.body[field] !== undefined) {
        return res.status(400).json({ error: `Field '${field}' cannot be updated directly.` });
      }
    }

    const { startDate, endDate, travelers, destinationIds } = req.body;

    // Validate dates if provided
    const effectiveStart = startDate || existing.startDate;
    const effectiveEnd = endDate || existing.endDate;
    if (new Date(effectiveEnd) <= new Date(effectiveStart)) {
      return res.status(400).json({ error: "endDate must be after startDate." });
    }

    if (travelers !== undefined && Number(travelers) < 1) {
      return res.status(400).json({ error: "travelers must be at least 1." });
    }

    if (destinationIds !== undefined && (!Array.isArray(destinationIds) || destinationIds.length < 1)) {
      return res.status(400).json({ error: "destinationIds must be a non-empty array." });
    }

    if (req.body.phone !== undefined && !/^\d{10}$/.test(req.body.phone)) {
      return res.status(400).json({ error: "phone must be exactly 10 digits." });
    }

    const updated = await bookingService.updateBooking(req.params.id, req.body);
    return res.status(200).json(updated);
  } catch (err) {
    console.error("updateBooking error:", err);
    if (err.status === 400) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

// ─── DELETE /api/bookings/:id (soft-cancel) ──────────────────────────────────
async function cancelBooking(req, res) {
  try {
    const booking = await bookingService.getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "You can only cancel your own bookings." });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({ error: "This booking is already cancelled." });
    }

    const updated = await bookingService.cancelBooking(req.params.id);
    return res.status(200).json({ message: "Booking cancelled.", booking: updated });
  } catch (err) {
    console.error("cancelBooking error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
};
