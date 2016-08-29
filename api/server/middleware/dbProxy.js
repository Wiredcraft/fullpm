'use strict';

const debug = require('debug')('fullpm:middleware:dbProxy');

// const util = require('util');
const Promise = require('bluebird');
const httpProxy = require('http-proxy');
const httpError = require('http-errors');

const lib = require('../lib');
const app = lib.app;
const middlewares = lib.middlewares;

module.exports = function(options) {

  // Router.
  const router = app.loopback.Router();

  // Proxy.
  const proxy = httpProxy.createProxyServer();
  proxy.on('error', debug);

  // Middlewares.
  router.use(middlewares.requireLogin);

  // :dbName
  router.param('dbName', function(req, res, next, dbName) {
    if (typeof dbName !== 'string') {
      return next(httpError(404));
    }
    // It's usually encoded.
    dbName = decodeURIComponent(dbName);
    // Validate name.
    const parts = dbName.split('/');
    // TODO: use config?
    // The 1st part is always 'fullpm'.
    if (parts.length !== 4 || parts[0] !== 'fullpm') {
      return next(httpError(404));
    }
    // The 3rd part can be 'github'.
    if (parts[2] === 'github') {
      // The 4th part is the ID.
      return Promise.resolve(app.models.GithubRepo.findById(parts[3])).then((repo) => {
        if (repo == null) {
          throw httpError(404);
        }
        req.repo = repo;
      }).asCallback(next);
    }
    return next(httpError(404));
  });

  router.all('/:dbName', function(req, res, next) {
    // Require writable for all operations for now.
    return req.repo.isWritable(req.user).then(() => {
      proxy.web(req, res, {
        target: app.dataSources.meta.settings.url
      });
    }, next);
  });

  router.all('/:dbName/*', function(req, res, next) {
    // Require writable for all operations for now.
    return req.repo.isWritable(req.user).then(() => {
      proxy.web(req, res, {
        target: app.dataSources.meta.settings.url
      });
    }, next);
  });

  router.get('/', function(req, res) {
    proxy.web(req, res, {
      target: app.dataSources.meta.settings.url
    });
  });

  return router;
};
