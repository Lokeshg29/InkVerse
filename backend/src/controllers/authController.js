/**
 * ============================================================
 * src/controllers/authController.js
 * ============================================================
 */

const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const generateToken = require('../utils/generateToken');

/**
 * POST /api/auth/register
 *
 * Body: { "name": "...", "email": "...", "password": "..." }
 *
 * Creates a new user. The User model's pre-save hook (built in
 * Phase 2) automatically hashes the password before saving -
 * we don't do any hashing logic here.
 */
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Name, email, and password are required', 400));
  }

  // Check if a user with this email already exists.
  // We check manually here (instead of only relying on Mongoose's
  // `unique: true`) so we can return a clean, friendly error message
  // rather than a raw MongoDB duplicate-key error.
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('An account with this email already exists', 400));
  }

  // User.create() triggers the pre-save hook -> password gets hashed
  const user = await User.create({ name, email, password });

  // Immediately log the user in after signup by issuing a token.
  // This is a common UX pattern - no need to separately log in
  // right after registering.
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * POST /api/auth/login
 *
 * Body: { "email": "...", "password": "..." }
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  // Remember: in the User model, password has `select: false`,
  // meaning it's excluded by default from query results.
  // We must explicitly request it here, since we need to compare it.
  const user = await User.findOne({ email }).select('+password');

  // SECURITY NOTE: we deliberately use the SAME error message whether
  // the email doesn't exist OR the password is wrong. If we said
  // "email not found" vs "wrong password" separately, an attacker
  // could use that to discover which emails are registered.
  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * GET /api/auth/me
 *
 * Returns the currently logged-in user's info.
 * Requires the `protect` middleware to run first, which attaches
 * `req.user` to the request.
 */
exports.getMe = catchAsync(async (req, res, next) => {
  // req.user was set by the `protect` middleware (see authMiddleware.js)
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
