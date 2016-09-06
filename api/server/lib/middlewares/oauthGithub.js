'use strict';

const debug = require('debug')('fullpm:middleware:oauthGithub');

// const lib = require('../');

// const _ = require('lodash');

const passport = require('passport');

module.exports = function(options) {
  return function oauthGithub(req) {
    // Handle OAuth callback.
    if (req.query != null && req.query.code != null) {
      debug('handling OAuth callback:', req.query);
      let successRedirect = options.successRedirect;
      if (req.query.redirect != null) {
        successRedirect = req.query.redirect;
      }
      return passport.authenticate('github', {
        successRedirect: successRedirect || null,
        failureRedirect: options.failureRedirect || null
      }).apply(passport, arguments);
    }

    // Handle login request.
    let scope = options.scope;
    let callbackURL = options.baseURL + (req.originalUrl || req.url);
    // if (req.query != null) {
    //   if (req.query.scope != null) {
    //     scope = _.chain(req.query.scope.split(','))
    //       .intersection(['user:email', 'read:org', 'public_repo', 'repo'])
    //       .union(scope.split(',')).join(',').value();
    //   }
    // }
    // debug('handling login:', req.query, scope, callbackURL);
    return passport.authenticate('github', {
      scope: scope,
      callbackURL: callbackURL
    }).apply(passport, arguments);
  };
};
