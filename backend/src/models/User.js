/**
 * ============================================================
 * src/models/User.js
 * ============================================================
 *
 * WHAT THIS REPRESENTS:
 * A customer account on InkVerse. This is the ONLY type of
 * account in our system (we deliberately scoped out artist/owner
 * roles - see project planning notes).
 *
 * SECURITY NOTE:
 * We NEVER store the plain-text password. Before saving, a
 * "pre-save hook" automatically hashes it using bcrypt.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // MongoDB creates a unique index - no two users can share an email
      lowercase: true, // "John@Email.com" -> "john@email.com" before saving
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/, // basic email pattern: something@something.something
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
      // select: false means when we query users (e.g. User.find()),
      // the password field is EXCLUDED by default. We have to
      // explicitly ask for it (.select('+password')) - this prevents
      // accidentally sending password hashes to the frontend.
    },

    // Array of references to Tattoo documents the user has favorited.
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tattoo',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ──────────────────────────────────────────────────────────────
// MIDDLEWARE (HOOKS): pre-save hashing
// ──────────────────────────────────────────────────────────────
//
// This function runs AUTOMATICALLY right before a User document
// is saved to the database (on .save() or .create()).
//
// 'pre' = "before". 'save' = the event we're hooking into.
// We use a regular function (not an arrow function) because we
// need Mongoose's `this` to refer to the document being saved.
//
// IMPORTANT (Mongoose 8+/9+): async middleware functions do NOT
// receive or call a `next` callback. Mongoose detects that this
// function returns a Promise (because it's `async`) and simply
// waits for it to resolve. Calling a `next` parameter here would
// throw "next is not a function", since nothing useful is passed
// into that argument anymore for async hooks.
userSchema.pre('save', async function () {
  // isModified('password') returns true only if the password
  // field was changed in THIS save operation.
  //
  // WHY THIS CHECK MATTERS: imagine a user updates their email.
  // Without this check, we'd re-hash their ALREADY-HASHED password
  // every time they save ANY change - turning their hash into a
  // hash-of-a-hash, breaking login forever.
  if (!this.isModified('password')) {
    return;
  }

  // bcrypt.genSalt(10) generates a "salt" - random data mixed into
  // the hash so two users with the same password get different hashes.
  // 10 is the "cost factor" - higher = slower = more secure but more CPU.
  const salt = await bcrypt.genSalt(10);

  // Replace the plain-text password with its hashed version.
  this.password = await bcrypt.hash(this.password, salt);

  // No next() call needed - just returning (implicitly, since this
  // is async) tells Mongoose the hook finished successfully.
});

// ──────────────────────────────────────────────────────────────
// INSTANCE METHOD: comparePassword
// ──────────────────────────────────────────────────────────────
//
// This adds a custom method to every User document.
// Usage (Phase 4): const isMatch = await user.comparePassword('typed-password');
//
// bcrypt.compare() hashes 'candidatePassword' with the SAME salt
// stored in 'this.password' and checks if the resulting hashes match.
// This is how login verification works WITHOUT ever decrypting anything.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
