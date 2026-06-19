/**
 * ============================================================
 * src/routes/tattooRoutes.js
 * ============================================================
 *
 * WHAT THIS FILE DOES:
 * Maps URLs to controller functions. No logic lives here -
 * just "when this URL + method is hit, call this function."
 */

const express = require('express');
const router = express.Router();
const tattooController = require('../controllers/tattooController');

// Because this router is mounted at '/api/tattoos' in app.js,
// these paths become:
//   GET /api/tattoos
//   GET /api/tattoos/:id
router.get('/', tattooController.getAllTattoos);
router.get('/:id', tattooController.getTattooById);

module.exports = router;
