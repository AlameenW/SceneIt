import { pool } from "../config/database.js";
import { seedDatabase } from "../config/seedData.js";

// Seeding endpoint - Run this once to populate your database
export const seedDatabaseController = async (req, res) => {
  try {
    console.log("Starting database seeding via API...");
    await seedDatabase();
    res.json({
      success: true,
      message: "Database seeded successfully with TMDB data!",
    });
  } catch (error) {
    console.error("Seeding failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
