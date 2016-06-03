'use strict';

var debug = require('debug')('kenhq:install');

var lib = require('./lib');

var app = module.exports = lib.app;

app.boot(function(err) {
  if (err) {
    throw err;
  }

  // Install data sources.
  var installed = {};
  var names = Object.keys(app.dataSources);
  for (var i = 0; i < names.length; i++) {
    var dataSource = app.dataSources[names[i]];
    if (installed[dataSource.settings.name] == null) {
      debug('installing:', names[i], dataSource.settings);
      installed[dataSource.settings.name] = true;
      dataSource.autoupdate(debug);
    }
  }
});
