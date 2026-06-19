/**
 * ============================================================
 * src/controllers/favoriteController.js
 * ============================================================
 *
 * Manages a logged-in user's favorited tattoos.
 * All routes here require the `protect` middleware - we always
 * know WHO the user is via req.user.
 */

const User = require('../models/User');
const Tattoo = require('../models/Tattoo');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/favorites
 *
 * Returns the logged-in user's full list of favorited tattoos.
 */
exports.getFavorites = catchAsync(async (req, res, next) => {
  // req.user only has the basic User document (set by `protect`).
  // We re-fetch it here WITH populate, since `protect` didn't
  // populate the favorites - keeps that middleware fast and generic.
  const user = await User.findById(req.user._id).populate({
    path: 'favorites',
    populate: { path: 'artist', select: 'name location rating' },
  });

  res.status(200).json({
    success: true,
    count: user.favorites.length,
    data: user.favorites,
  });
});

/**
 * POST /api/favorites/:tattooId
 *
 * Adds a tattoo to the logged-in user's favorites.
 */
exports.addFavorite = catchAsync(async (req, res, next) => {
  const { tattooId } = req.params;

  const tattoo = await Tattoo.findById(tattooId);
  if (!tattoo) {
    return next(new AppError('Tattoo not found', 404));
  }

  const user = await User.findById(req.user._id);

  // Prevent duplicate favorites. `.some()` checks if any element in
  // the array matches - here, if the tattoo is ALREADY favorited.
  // We convert to strings because ObjectId comparison with === does
  // NOT work directly (they're objects, not primitives).
  const alreadyFavorited = user.favorites.some(
    (favId) => favId.toString() === tattooId
  );

  if (alreadyFavorited) {
    return next(new AppError('Tattoo is already in your favorites', 400));
  }

  user.favorites.push(tattooId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Added to favorites',
    data: user.favorites,
  });
});

/**
 * DELETE /api/favorites/:tattooId
 *
 * Removes a tattoo from the logged-in user's favorites.
 */
exports.removeFavorite = catchAsync(async (req, res, next) => {
  const { tattooId } = req.params;

  const user = await User.findById(req.user._id);

  // .filter() keeps everything EXCEPT the tattoo being removed
  user.favorites = user.favorites.filter(
    (favId) => favId.toString() !== tattooId
  );

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Removed from favorites',
    data: user.favorites,
  });
});
