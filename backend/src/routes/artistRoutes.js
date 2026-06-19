/**
 * ============================================================
 * src/routes/artistRoutes.js
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');

router.get('/', artistController.getAllArtists);
router.get('/:id', artistController.getArtistById);

module.exports = router;
