'use strict';

// const debug = require('debug')('fullpm:middleware:auth');

// const util = require('util');
// const Promise = require('bluebird');

const lib = require('../lib');
const app = lib.app;
const middlewares = lib.middlewares;

module.exports = function(options) {
  const config = app.get('auth');

  // Router.
  const router = app.loopback.Router();

  // Github OAuth.
  // TODO: better redirects.
  router.get('/github', middlewares.oauthGithub({
    scope: config.github.scope,
    baseURL: config.baseURL,
    successRedirect: '/',
    failureRedirect: '/'
  }));

  // Logout.
  router.get('/logout', middlewares.requireLogin, middlewares.logout);

  // The current user.
  router.get('/user', middlewares.requireLogin, function(req, res) {
    return res.json(req.user);
  });

  return router;
};
