'use strict';

var debug = require('debug')('kenhq:middleware:dbProxy');

// var util = require('util');
// var Promise = require('bluebird');
var httpProxy = require('http-proxy');

var lib = require('../lib');
var app = lib.app;
// var utils = lib.utils;

module.exports = function(options) {

  // Router.
  var router = app.loopback.Router();

  // Proxy.
  var proxy = httpProxy.createProxyServer();
  proxy.on('error', debug);

  /**
   * :dbName
   */
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
