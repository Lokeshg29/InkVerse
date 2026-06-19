/**
 * ============================================================
 * src/utils/generateToken.js
 * ============================================================
 *
 * WHAT THIS FILE DOES:
 * Creates a signed JWT containing a user's ID.
 *
 * WHY A SEPARATE FILE:
 * Both the register AND login controllers need to create a token
 * after success. Instead of repeating this logic twice, we write
 * it once here.
 */

const jwt = require('jsonwebtoken');

/**
 * generateToken(userId)
 *
 * jwt.sign(payload, secret, options) creates a token.
 * - payload: the data we want to embed (just the user's ID - never
 *   put passwords or sensitive data here, since the payload is
 *   readable by anyone who has the token, even without the secret).
 * - secret: our private signing key (JWT_SECRET from .env). This is
 *   what makes the signature impossible to fake without knowing it.
 * - options.expiresIn: how long the token remains valid.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = generateToken;
