/**
 * ============================================================
 * src/utils/catchAsync.js
 * ============================================================
 *
 * WHY THIS EXISTS:
 * Every async controller function needs error handling. Without
 * this wrapper, we'd write try/catch in every single controller.
 *
 * catchAsync wraps a function so that if it throws (or its Promise
 * rejects), the error is automatically forwarded to Express's
 * error-handling middleware via next(err).
 *
 * USAGE:
 *   exports.getAllTattoos = catchAsync(async (req, res, next) => {
 *     const tattoos = await Tattoo.find();
 *     res.json(tattoos);
 *   });
 */

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
