'use strict';

const debug = require('debug')('fullpm:middleware:dbProxy');

// const util = require('util');
// const Promise = require('bluebird');
const httpProxy = require('http-proxy');

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
    // It's usually encoded.
    dbName = decodeURIComponent(dbName);
    // TODO:
    // Find a data source with the DB name.
    // Access control.
    next();
  });

  router.all('/:dbName', function(req, res, next) {
    proxy.web(req, res, {
      target: app.dataSources.meta.settings.url
    });
  });

  router.all('/:dbName/*', function(req, res, next) {
    proxy.web(req, res, {
      target: app.dataSources.meta.settings.url
    });
  });

  router.get('/', function(req, res) {
    proxy.web(req, res, {
      target: app.dataSources.meta.settings.url
    });
  });

  return router;
};
