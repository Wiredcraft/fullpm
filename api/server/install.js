'use strict';

const debug = require('debug')('kenhq:install');

const lib = require('./lib');

const app = module.exports = lib.app;

app.boot(function(err) {
  if (err) {
    throw err;
  }

  // Install data sources.
  let installed = {};
  const names = Object.keys(app.dataSources);
  for (let i = 0; i < names.length; i++) {
    const dataSource = app.dataSources[names[i]];
    if (installed[dataSource.settings.name] == null) {
      debug('installing:', names[i], dataSource.settings);
      installed[dataSource.settings.name] = true;
      dataSource.autoupdate((err) => {
        if (err) {
          debug('error:', err);
        }
        dataSource.disconnect(debug);
      });
    }
  }
});
