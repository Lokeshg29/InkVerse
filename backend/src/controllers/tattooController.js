/**
 * ============================================================
 * src/controllers/tattooController.js
 * ============================================================
 *
 * WHAT THIS FILE DOES:
 * Contains the actual LOGIC for tattoo-related API endpoints.
 * Routes (tattooRoutes.js) just point a URL here - this file
 * does the real work: talking to MongoDB and deciding what
 * to send back.
 */

const Tattoo = require('../models/Tattoo');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/tattoos
 *
 * Returns a list of tattoos. Supports optional query parameters:
 *   ?style=Japanese        -> only tattoos with this style
 *   ?search=dragon         -> only tattoos whose title matches "dragon"
 *   ?page=2&limit=8        -> pagination (page 2, 8 results per page)
 *
 * Example: GET /api/tattoos?style=Blackwork&page=1&limit=8
 */
exports.getAllTattoos = catchAsync(async (req, res, next) => {
  // req.query holds everything after the "?" in the URL, as an object.
  // e.g. /api/tattoos?style=Japanese&page=2  ->  req.query = { style: 'Japanese', page: '2' }
  const { style, search, page = 1, limit = 8 } = req.query;

  // We build a "filter" object step by step. Mongoose's .find(filter)
  // will only return documents matching ALL the conditions in this object.
  const filter = {};

  if (style && style !== 'All') {
    filter.style = style;
  }

  if (search) {
    // $regex performs a partial text match (like SQL's LIKE '%search%').
    // $options: 'i' makes it case-insensitive, so "Dragon" matches "dragon".
    filter.title = { $regex: search, $options: 'i' };
  }

  // Pagination math:
  // page 1 -> skip 0 documents
  // page 2 -> skip `limit` documents
  // page 3 -> skip `limit * 2` documents
  const skip = (Number(page) - 1) * Number(limit);

  // Run two queries:
  // 1. Get the actual page of tattoos, populating artist info
  // 2. Count the TOTAL number of matching tattoos (for pagination UI)
  const [tattoos, total] = await Promise.all([
    Tattoo.find(filter)
      .populate('artist', '_id name location rating') // fetch required artist fields including _id
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }), // newest first
    Tattoo.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: tattoos.length,
    total,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    data: tattoos,
  });
});

/**
 * GET /api/tattoos/:id
 *
 * Returns a single tattoo by its MongoDB _id.
 */
exports.getTattooById = catchAsync(async (req, res, next) => {
  const tattoo = await Tattoo.findById(req.params.id).populate(
    'artist',
    '_id name location rating photoUrl specialties'
  );

  // If no tattoo was found with that ID, Mongoose returns `null`,
  // NOT an error. We have to check for this ourselves.
  if (!tattoo) {
    // AppError(message, statusCode) - caught by our global error handler
    return next(new AppError('Tattoo not found', 404));
  }

  res.status(200).json({
    success: true,
    data: tattoo,
  });
});
