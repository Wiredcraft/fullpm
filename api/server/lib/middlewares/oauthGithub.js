'use strict';

// var lib = require('../');

// var _ = require('lodash');

var passport = require('passport');

module.exports = function(options) {
  return function oauthGithub(req) {
    // Handle OAuth callback.
    if (req.query != null && req.query.code != null) {
      return passport.authenticate('github', {
        successRedirect: options.successRedirect || null,
        failureRedirect: options.failureRedirect || null
      }).apply(passport, arguments);
    }

    // Handle login request.
    var scope = options.scope;
    // if (req.query != null && req.query.scope != null) {
    //   scope = _.chain(req.query.scope.split(','))
    //     .intersection(['user:email', 'read:org', 'public_repo', 'repo'])
    //     .union(scope.split(',')).join(',').value();
    // }
    var callbackURL = options.baseURL + (req.originalUrl || req.url);
    return passport.authenticate('github', {
      scope: scope,
      callbackURL: callbackURL
    }).apply(passport, arguments);
  };
};
