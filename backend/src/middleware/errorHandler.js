/**
 * ============================================================
 * src/middleware/errorHandler.js
 * ============================================================
 *
 * WHAT THIS FILE DOES:
 * Catches EVERY error thrown anywhere in our app (via next(err)
 * or a rejected Promise inside catchAsync) and turns it into a
 * clean, consistent JSON response.
 *
 * Express recognizes this as an error handler because it has
 * FOUR parameters: (err, req, res, next). This must be registered
 * LAST in app.js, after all routes.
 */

const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose CastError: happens when an invalid MongoDB ObjectId
  // is used, e.g. GET /api/tattoos/not-a-real-id
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose ValidationError: a required field is missing, or
  // a value violates a schema rule (e.g. enum, min, max).
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // MongoDB duplicate key error (e.g. our Booking compound index,
  // or User's unique email).
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate value: this record already exists';
  }

  // jwt.verify() throws this when the token's signature is invalid
  // or it's malformed (e.g. tampered with, or not a real JWT at all).
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  // jwt.verify() throws this specifically when the token has expired
  // (past the expiresIn duration set when it was created).
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
