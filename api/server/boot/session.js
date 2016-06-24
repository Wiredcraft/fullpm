'use strict';

// var debug = require('debug')('kenhq:session');

var passport = require('passport');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var GitHubStrategy = require('passport-github').Strategy;

var lib = require('../lib');
var cleanGithubRes = lib.utils.cleanGithubRes;

module.exports = function(app, callback) {
  initPassport(app);

  // Get the redis client from the connector.
  app.dataSources.session.connector.connect().then(function(redis) {
    var config = app.get('session');

    // Express session.
    app.middleware('session', session({
      store: new RedisStore({
        client: redis,
        ttl: config.ttl || 86400
      }),
      resave: false,
      saveUninitialized: false,
      name: config.name || 'kenhq.sid',
      secret: config.secret || 'keyboard cat'
    }));

    // Passport.
    app.middleware('session', passport.initialize());
    app.middleware('session', passport.session());

  }).asCallback(callback);
};

function initPassport(app) {
  // TODO: save user with a model.

  passport.serializeUser(function(info, done) {
    // debug('serializeUser', info);
    return done(null, info);
  });

  passport.deserializeUser(function(info, done) {
    // debug('deserializeUser', info);
    return done(null, info);
  });

  var config = app.get('auth').github;

  passport.use(new GitHubStrategy({
      clientID: config.clientID,
      clientSecret: config.clientSecret
    },
    function(accessToken, refreshToken, profile, cb) {
      if (profile._json == null) {
        return cb();
      }
      var data = cleanGithubRes(profile._json);
      // We need the token.
      data.accessToken = accessToken;
      cb(null, data);
    }
  ));
}
