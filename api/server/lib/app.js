var lib = require('./');
var path = require('path');

// Singleton.
module.exports = lib.extended.loopback(path.resolve(__dirname, '../'));
