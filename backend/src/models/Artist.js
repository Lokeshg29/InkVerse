/**
 * ============================================================
 * src/models/Artist.js
 * ============================================================
 *
 * WHAT THIS REPRESENTS:
 * A tattoo artist. This is PURE DATA — artists don't log in,
 * don't have accounts, and don't manage anything. We (the admin)
 * will seed the database with realistic artist records.
 *
 * WHO USES THIS:
 * - The "Artists" page (grid of artist cards)
 * - The "Tattoo" model references this (every tattoo has an artist)
 * - The "Booking" model references this (every booking is with an artist)
 */

const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true, // removes leading/trailing whitespace, e.g. "  Nova Sinclair  " -> "Nova Sinclair"
    },

    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },

    photoUrl: {
      type: String,
      required: [true, 'Artist photo is required'],
    },

    location: {
      type: String,
      required: true,
      // e.g. "London, UK"
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
    },

    specialties: {
      // An ARRAY of strings, e.g. ["Tribal", "Geometric"]
      // [String] means "array where each element is a String"
      type: [String],
      default: [],
    },

    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    // timestamps: true automatically adds two fields to every document:
    // createdAt (when the document was first saved)
    // updatedAt (when it was last modified)
    // Mongoose manages these for us - we never set them manually.
    timestamps: true,
  }
);

// mongoose.model(name, schema) does two things:
// 1. Registers the schema under the name 'Artist'
// 2. Returns a MODEL - a class with methods like:
//    Artist.find(), Artist.findById(), Artist.create(), etc.
//
// IMPORTANT: Mongoose automatically converts 'Artist' (singular,
// capitalized) into 'artists' (plural, lowercase) for the actual
// MongoDB collection name.
const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
