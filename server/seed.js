require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Destination = require("./models/Destination");

const destinations = [
  { name: "Sigiriya Rock Fortress", district: "Matale", category: "Cultural", entryFeeLKR: 5000, estimatedDailyCostLKR: 4500, description: "Ancient rock fortress." },
  { name: "Ella", district: "Badulla", category: "Hill Country", entryFeeLKR: 0, estimatedDailyCostLKR: 3500, description: "Beautiful small town in the highlands." },
  { name: "Galle Fort", district: "Galle", category: "Cultural", entryFeeLKR: 0, estimatedDailyCostLKR: 3000, description: "Historical fort built by the Portuguese." },
  { name: "Yala National Park", district: "Hambantota", category: "Wildlife", entryFeeLKR: 1000, estimatedDailyCostLKR: 5000, description: "Famous for leopards and elephants." },
  { name: "Nuwara Eliya", district: "Nuwara Eliya", category: "Hill Country", entryFeeLKR: 0, estimatedDailyCostLKR: 4000, description: "Little England of Sri Lanka." },
  { name: "Mirissa Beach", district: "Matara", category: "Beach", entryFeeLKR: 0, estimatedDailyCostLKR: 3500, description: "Whale watching and sunny beaches." },
  { name: "Kandy (Temple of Tooth)", district: "Kandy", category: "Religious", entryFeeLKR: 1500, estimatedDailyCostLKR: 3500, description: "Sacred temple holding Buddha's tooth relic." },
  { name: "Anuradhapura", district: "Anuradhapura", category: "Cultural", entryFeeLKR: 2500, estimatedDailyCostLKR: 3000, description: "Ancient capital with historical ruins." },
  { name: "Nine Arch Bridge", district: "Badulla", category: "Adventure", entryFeeLKR: 0, estimatedDailyCostLKR: 2500, description: "Iconic colonial-era railway bridge." },
  { name: "Dambulla Cave Temple", district: "Matale", category: "Religious", entryFeeLKR: 1500, estimatedDailyCostLKR: 2500, description: "Largest and best-preserved cave temple complex." },
  { name: "Arugam Bay", district: "Ampara", category: "Beach", entryFeeLKR: 0, estimatedDailyCostLKR: 3000, description: "Popular surf destination." },
  { name: "Horton Plains", district: "Nuwara Eliya", category: "Wildlife", entryFeeLKR: 1500, estimatedDailyCostLKR: 3500, description: "Beautiful national park and World's End." },
  { name: "Adams Peak (Sri Pada)", district: "Ratnapura", category: "Adventure", entryFeeLKR: 0, estimatedDailyCostLKR: 2500, description: "Sacred mountain with a footprint relic." }
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("No MONGO_URI in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Seed destinations
    await Destination.deleteMany({});
    await Destination.insertMany(destinations);
    console.log("Destinations seeded.");

    // Seed Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@sltripplanner.lk";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const password = process.env.ADMIN_PASSWORD || "Admin@1234";
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const adminUser = new User({
        fullName: process.env.ADMIN_NAME || "Admin User",
        email: adminEmail,
        passwordHash,
        role: "admin"
      });
      await adminUser.save();
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      console.log("Admin user already exists. Skipping.");
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
