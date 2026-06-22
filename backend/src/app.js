/**
 * ============================================================
 * src/app.js
 * ============================================================
 *
 * WHAT THIS FILE DOES:
 * Configures the Express application — registers middleware
 * (functions that run on every request) and routes (URL handlers).
 *
 * WHAT THIS FILE DOES NOT DO:
 * It does NOT start the server. That happens in server.js.
 * This separation means we can `require('./app')` in automated
 * tests without actually opening a network port.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Load .env variables into process.env.
// This must happen before we read any process.env value below.
require('dotenv').config();

// Create the Express application object.
// Everything (routes, middleware) attaches to this single object.
const app = express();

// ──────────────────────────────────────────────────────────────
// MIDDLEWARE PIPELINE
// Order matters! Each request flows through these top-to-bottom.
// ──────────────────────────────────────────────────────────────

// 1. helmet() — sets ~15 security-related HTTP response headers.
//    Example: it sets "X-Content-Type-Options: nosniff" which stops
//    browsers from trying to "guess" a file's type, closing a class
//    of attacks called MIME-sniffing attacks.
app.use(helmet());

// 2. cors() — allows our Next.js frontend (different port = different
//    "origin" in browser terms) to call this API.
//    Without this, the BROWSER blocks the request before it even
//    leaves the frontend — you'd see a CORS error in the console.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN, // only this origin is allowed
    credentials: true,                  // allow cookies / auth headers
  })
);

// 3. morgan('dev') — logs every request to the terminal.
//    Format: METHOD URL STATUS RESPONSE_TIME - RESPONSE_SIZE
//    Example: GET /api/health 200 2.345 ms - 55
app.use(morgan('dev'));

// 4. express.json() — parses incoming request bodies that are JSON.
//    WITHOUT this line, if a client sends:
//      POST /api/bookings
//      Body: { "tattooId": "123" }
//    then req.body would be `undefined`. WITH this line,
//    req.body becomes the actual JavaScript object { tattooId: "123" }.
app.use(express.json());
app.get('/render-test', (req, res) => {
  res.json({
    message: 'RENDER_DEPLOYMENT_WORKING_123'
  });
});

// ──────────────────────────────────────────────────────────────
// ROUTES
// ──────────────────────────────────────────────────────────────

// Health check endpoint - confirms the server is alive.
// GET http://localhost:5000/api/health
app.use('/api/health', require('./routes/health'));

// Phase 3 - REST API routes
app.use('/api/tattoos', require('./routes/tattooRoutes'));
app.use('/api/artists', require('./routes/artistRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// AI Match route
app.use('/api/ai', require('./routes/aiRoutes'));

// Phase 4 - Authentication and Favorites
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));

// ──────────────────────────────────────────────────────────────
// 404 HANDLER
// If a request doesn't match ANY route above, it falls through to
// here. This middleware has no "next URL" to match, so it just
// returns a clean JSON 404 instead of Express's default HTML page.
// ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.method} ${req.originalUrl} on this server`,
  });
});

// ──────────────────────────────────────────────────────────────
// GLOBAL ERROR HANDLER
// Must be registered LAST. Catches every error passed via next(err)
// anywhere in the app (routes, controllers, etc.) and returns a
// clean, consistent JSON error response.
// ──────────────────────────────────────────────────────────────
app.use(require('./middleware/errorHandler'));

module.exports = app;
