/**
 * ============================================================
 * src/middleware/authMiddleware.js
 * ============================================================
 *
 * WHAT THIS FILE DOES:
 * Exports a middleware function called `protect`. Any route that
 * uses this middleware requires a valid JWT to access.
 *
 * USAGE (in a routes file):
 *   router.post('/', protect, bookingController.createBooking);
 *
 * `protect` runs BEFORE the controller. If it calls next() without
 * an error, the controller runs. If it calls next(new AppError(...)),
 * the request stops there and goes straight to our error handler.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Step 1: Look for the Authorization header, formatted as:
  // "Bearer eyJhbGciOiJIUzI1NiJ9..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Split "Bearer <token>" into ["Bearer", "<token>"] and take index 1
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to continue.', 401)
    );
  }

  // Step 2: Verify the token.
  // jwt.verify() does TWO things at once:
  //   a) Checks the signature is valid (proves WE issued this token,
  //      and nobody tampered with it)
  //   b) Checks the token hasn't expired
  // If either check fails, it THROWS an error - which catchAsync
  // automatically forwards to our error handler (which has specific
  // handling for JWT errors - see errorHandler.js).
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // decoded looks like: { id: '665f1a2b...', iat: 123456, exp: 123999 }

  // Step 3: Find the actual user in the database.
  // WHY check this, if the token is already verified? Because the
  // user might have been deleted AFTER the token was issued. A valid
  // signature doesn't guarantee the user still exists.
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  }

  // Step 4: Attach the user to the request object.
  // Every controller after this middleware can now access req.user
  req.user = user;

  next(); // proceed to the actual route handler
});
