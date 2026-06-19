/**
 * ============================================================
 * src/routes/health.js
 * ============================================================
 *
 * WHAT THIS FILE DOES:
 * Defines ONE route: GET /api/health
 * This route exists purely to confirm "yes, the server is running
 * and responding to requests."
 *
 * WHY A SEPARATE FILE:
 * Even though it's tiny, we keep each "resource" (health, tattoos,
 * artists, bookings...) in its own routes file. This is the pattern
 * we'll repeat for every feature in Phase 3.
 */

const express = require('express');

// express.Router() creates a "mini Express app" — it has its own
// .get(), .post(), etc. but doesn't run on its own. We export it,
// and app.js "mounts" it onto a URL prefix with app.use().
const router = express.Router();

// Because this router is mounted at '/api/health' in app.js,
// this route '/' actually corresponds to the full URL '/api/health'.
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'InkVerse API is healthy',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
