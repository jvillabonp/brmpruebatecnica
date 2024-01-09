const authMiddleware = require('./authMiddleware');
const roleMiddleware = require('./roleMiddleware');
const validateJsonMiddleware = require('./validateJsonMiddleware');

module.exports = {
  authMiddleware,
  roleMiddleware,
  validateJsonMiddleware
};