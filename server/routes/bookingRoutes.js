const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const bookingController = require("../controllers/bookingController");

// IMPORTANT: /mine must be registered BEFORE /:id
// Otherwise Express treats the string "mine" as a MongoDB ObjectId and throws a cast error.

router.get("/mine", verifyToken, bookingController.getMyBookings);
router.post("/", verifyToken, bookingController.createBooking);
router.get("/:id", verifyToken, bookingController.getBookingById);
router.put("/:id", verifyToken, bookingController.updateBooking);
router.delete("/:id", verifyToken, bookingController.cancelBooking);

module.exports = router;
