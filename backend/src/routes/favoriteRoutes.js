/**
 * ============================================================
 * src/routes/favoriteRoutes.js
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

// Every favorites route requires login.
// We can apply `protect` to ALL routes in this router at once
// using router.use() - cleaner than repeating it on every line.
router.use(protect);

router.get('/', favoriteController.getFavorites);
router.post('/:tattooId', favoriteController.addFavorite);
router.delete('/:tattooId', favoriteController.removeFavorite);

module.exports = router;
