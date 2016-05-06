'use strict';

var debug = require('debug')('kenhq:middleware:proxy');

var httpProxy = require('http-proxy');

var lib = require('../lib');
var app = lib.app;

module.exports = proxy;

function proxy(options) {

  // .
  var proxy = httpProxy.createProxyServer();
  proxy.on('error', debug);

  // .
  var meta = app.dataSources.meta;

  // TODO: from config.
  var rootPath = '/proxy/meta';

  return function proxyHandler(req, res, next) {
    if (!req.url.startsWith(rootPath)) {
      return next();
    }
    // Target URL. TODO: clone req?
    req.url = req.url.substr(rootPath.length);
    meta.connector.getDbUrl().then(function(dbUrl) {
      proxy.web(req, res, {
        target: dbUrl
      });
    }).catch(next);
  };
}
