/**
 * ============================================================
 * src/utils/AppError.js
 * ============================================================
 *
 * WHY THIS EXISTS:
 * A normal JavaScript Error only has a `message`. Our API also
 * needs an HTTP status code (404, 400, 409...) attached to every
 * error. This class adds that.
 *
 * USAGE:
 *   throw new AppError('Tattoo not found', 404);
 *   return next(new AppError('Booking conflict', 409));
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // sets this.message
    this.statusCode = statusCode;
    this.isOperational = true; // marks this as an "expected" error, not a bug
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
