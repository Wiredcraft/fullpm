'use strict';

// var debug = require('debug')('kenhq:middleware:auth');

// var util = require('util');
// var Promise = require('bluebird');

var lib = require('../lib');
var app = lib.app;

module.exports = function(options) {
  var config = app.get('auth');

  // Router.
  var router = app.loopback.Router();

  // Github OAuth.
  // TODO: better redirects.
  router.get('/github', lib.middlewares.oauthGithub({
    scope: config.github.scope,
    baseURL: config.baseURL,
    successRedirect: '/',
    failureRedirect: '/'
  }));

  // Logout.
  router.get('/logout', lib.middlewares.logout());

  return router;
};
