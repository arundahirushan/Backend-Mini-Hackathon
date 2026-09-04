const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ["Beach", "Hill Country", "Wildlife", "Cultural", "Adventure", "Religious"] 
  },
  description: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  entryFeeLKR: { type: Number, default: 0 },
  recommendedDays: { type: Number, default: 1 },
  bestSeasonMonths: { type: String, default: "" },
  travelTip: { type: String, default: "" },
  estimatedDailyCostLKR: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Destination", destinationSchema);
