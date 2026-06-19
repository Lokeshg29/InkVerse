/**
 * ============================================================
 * src/models/Tattoo.js
 * ============================================================
 *
 * WHAT THIS REPRESENTS:
 * A single tattoo design shown in the Gallery and Book pages.
 *
 * KEY CONCEPT - THE 'artist' FIELD:
 * Instead of copying the entire artist's data into every tattoo
 * document (duplication), we store a REFERENCE - just the artist's
 * unique _id. Later, we can ask Mongoose to "populate" this field,
 * which fetches the full Artist document automatically.
 *
 * Think of it like a foreign key in SQL, but MongoDB doesn't
 * enforce it - Mongoose + our code enforce it.
 */

const mongoose = require('mongoose');

// We define the allowed tattoo styles as a constant.
// Using this in BOTH the schema (for validation) and later in our
// frontend filter pills keeps everything consistent.
const TATTOO_STYLES = [
  'Traditional',
  'Anime',
  'Japanese',
  'Realism',
  'Tribal',
  'Geometric',
  'Minimalist',
  'Blackwork',
  'Watercolor',
];

const tattooSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Tattoo title is required'],
      trim: true,
      // e.g. "Crimson Dragon", "Lunar Koi"
    },

    description: {
      type: String,
      default: '',
    },

    imageUrl: {
      type: String,
      required: [true, 'Tattoo image is required'],
    },

    style: {
      type: String,
      required: true,
      // enum restricts this field to ONLY the values in TATTOO_STYLES.
      // If someone tries to save style: "Cartoon", Mongoose throws
      // a ValidationError BEFORE it ever reaches the database.
      enum: {
        values: TATTOO_STYLES,
        message: '{VALUE} is not a supported tattoo style',
      },
    },

    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },

    // ── THE RELATIONSHIP ──────────────────────────────────────
    artist: {
      type: mongoose.Schema.Types.ObjectId, // stores a MongoDB ObjectId
      ref: 'Artist',                         // tells Mongoose WHICH model this ID refers to
      required: true,
    },

    tags: {
      // Free-form descriptive tags, useful later for AI matching
      // e.g. ["dragon", "fine-line", "asian-inspired"]
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Tattoo = mongoose.model('Tattoo', tattooSchema);

module.exports = Tattoo;
module.exports.TATTOO_STYLES = TATTOO_STYLES;
