/**
 * ============================================================
 * src/controllers/bookingController.js
 * ============================================================
 *
 * REMEMBER OUR SCOPE DECISION:
 * No artist approval workflow. A booking is created and
 * immediately confirmed. The only check: is this artist already
 * booked for this exact date + timeSlot?
 */

const Booking = require('../models/Booking');
const Tattoo = require('../models/Tattoo');
const Artist = require('../models/Artist');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * POST /api/bookings
 *
 * REQUIRES LOGIN (the `protect` middleware runs before this).
 *
 * Expected request body (JSON):
 * {
 *   "tattoo": "<tattoo ObjectId>",
 *   "artist": "<artist ObjectId>",
 *   "date": "2026-07-01",
 *   "timeSlot": "14:00 - 15:00"
 * }
 *
 * NOTE: we no longer accept 'user' in the body. It comes from
 * req.user, which the `protect` middleware set after verifying
 * the JWT. This means a user can ONLY ever book for themselves -
 * they cannot pretend to be someone else, even if they tried to
 * pass a different user ID in the request body.
 */
exports.createBooking = catchAsync(async (req, res, next) => {
  const { tattoo, artist, date, timeSlot } = req.body;
  const user = req.user._id; // <-- comes from the verified JWT, not the body

  // ── Step 1: Basic presence validation ────────────────────────
  if (!tattoo || !artist || !date || !timeSlot) {
    return next(
      new AppError('tattoo, artist, date, and timeSlot are all required', 400)
    );
  }

  // ── Step 2: Confirm the referenced Tattoo and Artist actually exist ──
  // Without this check, you could create a booking pointing to a
  // tattoo/artist ID that doesn't exist - MongoDB wouldn't stop you,
  // since it doesn't enforce foreign keys like SQL does.
  const [tattooExists, artistExists] = await Promise.all([
    Tattoo.findById(tattoo),
    Artist.findById(artist),
  ]);

  if (!tattooExists) {
    return next(new AppError('Tattoo not found', 404));
  }
  if (!artistExists) {
    return next(new AppError('Artist not found', 404));
  }

  // ── Step 3: Check for double-booking ──────────────────────────
  // Look for an EXISTING confirmed booking with the SAME artist,
  // date, and timeSlot. If found, reject this new booking with a
  // friendly error BEFORE hitting our database's unique index
  // (which would otherwise throw a less readable duplicate-key error).
  const existingBooking = await Booking.findOne({
    artist,
    date: new Date(date),
    timeSlot,
    status: 'confirmed',
  });

  if (existingBooking) {
    return next(
      new AppError(
        'This artist is already booked for that date and time slot',
        409 // 409 Conflict - the standard status code for "this clashes with existing data"
      )
    );
  }

  // ── Step 4: Create the booking ────────────────────────────────
  const booking = await Booking.create({
    user,
    tattoo,
    artist,
    date,
    timeSlot,
  });

  res.status(201).json({
    success: true,
    data: booking,
  });
});

/**
 * GET /api/bookings/my
 *
 * Returns bookings belonging to the authenticated user.
 */
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('tattoo', 'title imageUrl')
    .populate('artist', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: bookings,
  });
});

/**
 * GET /api/bookings/:id
 *
 * Returns one booking with full user/tattoo/artist details populated.
 */
exports.getBookingById = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('tattoo', 'title style price imageUrl')
    .populate('artist', 'name location rating');

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});
