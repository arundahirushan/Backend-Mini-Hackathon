const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    touristName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    travelers: {
      type: Number,
      required: true,
      min: 1,
    },
    destinationIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Destination" }],
      required: true,
      validate: {
        validator: (arr) => arr.length >= 1,
        message: "At least one destination is required.",
      },
    },
    totalDays: {
      type: Number,
    },
    estimatedTotalCostLKR: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    notes: {
      type: String,
      default: "",
    },
    bookingRef: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
