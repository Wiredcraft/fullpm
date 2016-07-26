'use strict';

const httpError = require('http-errors');

module.exports = function requireLogin(req, res, next) {
  if (typeof req.isAuthenticated === 'function' && req.isAuthenticated()) {
    return next();
  }
  return next(httpError(401));
};
