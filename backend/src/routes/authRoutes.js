/**
 * ============================================================
 * src/routes/authRoutes.js
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes - no token needed
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route - the `protect` middleware runs FIRST.
// Only if it succeeds does authController.getMe ever run.
router.get('/me', protect, authController.getMe);

module.exports = router;
