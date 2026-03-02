/**
 * Async handler to wrap async route controllers and eliminate try-catch blocks
 * @param {Function} fn - The asynchronous controller function
 * @returns {Function} - Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
