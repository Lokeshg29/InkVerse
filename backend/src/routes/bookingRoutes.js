/**
 * ============================================================
 * src/routes/bookingRoutes.js
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Both routes require a logged-in user.
// `protect` runs first - if it fails, the controller never runs.
router.post('/', protect, bookingController.createBooking);
router.get('/:id', protect, bookingController.getBookingById);

module.exports = router;
