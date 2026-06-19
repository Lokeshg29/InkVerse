/**
 * ============================================================
 * src/models/Booking.js
 * ============================================================
 *
 * WHAT THIS REPRESENTS:
 * A confirmed appointment - a User booking a specific Tattoo
 * design with a specific Artist, on a specific date and time slot.
 *
 * SCOPE DECISION (from project planning):
 * No "pending approval" workflow. When a user completes the
 * booking flow, this document is created immediately with
 * status: 'confirmed'. The only check we perform is whether
 * the artist already has a booking for that exact date + timeSlot.
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    tattoo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tattoo',
      required: true,
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },

    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },

    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      // e.g. "14:00 - 15:00"
    },

    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// ──────────────────────────────────────────────────────────────
// COMPOUND INDEX: prevent double-booking
// ──────────────────────────────────────────────────────────────
//
// An index makes lookups on these fields FAST. But here we're
// using it for something extra: by adding `unique: true`, MongoDB
// will REJECT any attempt to insert a second document with the
// same combination of artist + date + timeSlot (while confirmed).
//
// This is our "double-booking prevention" at the database level -
// the strongest possible guarantee, because even if our application
// code has a bug, the database itself refuses the duplicate.
//
// We'll also check this in our controller (Phase 3) to return
// a friendly error message - this index is the final safety net.
bookingSchema.index(
  { artist: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: 'confirmed' } }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
