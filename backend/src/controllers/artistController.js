/**
 * ============================================================
 * src/controllers/artistController.js
 * ============================================================
 */

const Artist = require('../models/Artist');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/artists
 *
 * Supports:
 *   ?specialty=Tribal     -> only artists with this specialty
 *   ?search=nova          -> only artists whose name matches "nova"
 */
exports.getAllArtists = catchAsync(async (req, res, next) => {
  const { specialty, search } = req.query;

  const filter = {};

  if (specialty && specialty !== 'All') {
    // specialties is an ARRAY field. This filter finds any artist
    // whose specialties array CONTAINS this value.
    filter.specialties = specialty;
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const artists = await Artist.find(filter).sort({ rating: -1 }); // highest rated first

  res.status(200).json({
    success: true,
    count: artists.length,
    data: artists,
  });
});

/**
 * GET /api/artists/:id
 */
exports.getArtistById = catchAsync(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);

  if (!artist) {
    return next(new AppError('Artist not found', 404));
  }

  res.status(200).json({
    success: true,
    data: artist,
  });
});
