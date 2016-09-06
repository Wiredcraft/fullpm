'use strict';

const debug = require('debug')('fullpm:session');

const Promise = require('bluebird');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const GitHubStrategy = require('passport-github').Strategy;

const lib = require('../lib');
const cleanGithubRes = lib.utils.cleanGithubRes;

module.exports = function(app, callback) {
  initPassport(app);

  // Get the redis client from the connector.
  app.dataSources.session.connector.connect().then((redis) => {
    const config = app.get('session');

    // Express session.
    app.middleware('session', session({
      store: new RedisStore({
        client: redis,
        ttl: config.ttl || 86400
      }),
      resave: false,
      saveUninitialized: false,
      name: config.name || 'fullpm.sid',
      secret: config.secret || 'keyboard cat'
    }));

    // Passport.
    app.middleware('session', passport.initialize());
    app.middleware('session', passport.session());

  }).asCallback(callback);
};

function initPassport(app) {
  const config = app.get('auth').github;

  // Save user with a model.
  const GithubUser = app.models.GithubUser;

  passport.serializeUser(function(info, done) {
    // debug('serializeUser', info);
    return Promise.resolve(GithubUser.findById(info.id)).then((user) => {
      if (user == null) {
        // Create.
        debug('creating:', info.name);
        return GithubUser.create(info).then((user) => {
          return {
            id: info.id,
            accessToken: info.accessToken
          };
        });
      } else {
        // Update.
        debug('updating:', info.name);
        return GithubUser.replaceById(info.id, info).then((user) => {
          return {
            id: info.id,
            accessToken: info.accessToken
          };
        });
      }
    }).asCallback(done);
  });

  passport.deserializeUser(function(info, done) {
    // debug('deserializeUser', info);
    return Promise.resolve(GithubUser.findById(info.id)).then((user) => {
      if (user == null) {
        // Fail.
        debug('user not saved:', info.name);
        return info;
      } else {
        user.accessToken = info.accessToken;
        return user;
      }
    }).asCallback(done);
  });

  passport.use(new GitHubStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret
  }, function(accessToken, refreshToken, profile, cb) {
    if (profile._json == null) {
      return cb();
    }
    let data = cleanGithubRes(profile._json);
    // We need the token.
    data.accessToken = accessToken;
    cb(null, data);
  }));
}
