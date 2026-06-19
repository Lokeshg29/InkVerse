/**
 * ============================================================
 * server.js
 * ============================================================
 *
 * Entry point. Connects to MongoDB, then starts the Express server.
 */

const app = require('./src/app');
const connectDB = require('./src/config/db');

require('dotenv').config();

const PORT = process.env.PORT || 5000;

// connectDB() is async - it returns a Promise.
// We connect to the database FIRST, and only start listening
// for HTTP requests AFTER the connection succeeds.
//
// Why does order matter? If a request hits a route that queries
// MongoDB before the connection is ready, it would fail with a
// confusing error. Connecting first guarantees the DB is ready
// before we accept any traffic.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`InkVerse API running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
});
