/**
 * ============================================================
 * src/config/db.js
 * ============================================================
 *
 * WHAT THIS FILE DOES:
 * Connects our Express app to MongoDB using Mongoose.
 *
 * WHY A SEPARATE FILE:
 * Connection logic is configuration, not a route or a model.
 * Keeping it isolated means if we ever switch databases or
 * connection strategies, we only touch this one file.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect() returns a Promise.
    // We `await` it — if it fails, the catch block runs.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // conn.connection.host tells us WHICH cluster we connected to.
    // Useful for confirming you're hitting the right database.
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    // If the database connection fails, there's no point running
    // the API at all - every route would fail. So we exit immediately.
    process.exit(1);
  }
};

module.exports = connectDB;
