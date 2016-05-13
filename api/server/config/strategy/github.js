/**
 * Strategy for passport github
 * @see https://github.com/jaredhanson/passport-github#configure-strategy
 */
const GitHubStrategy = require('passport-github').Strategy;

module.exports = (app) => {
  // Config of developer applications
  const githubConfig = app.get('github');

  return new GitHubStrategy({
    clientID: githubConfig.clientId,
    clientSecret: githubConfig.clientSecret,
    callbackURL: githubConfig.callbackURL
  }, (accessToken, refreshToken, profile, cb) => {
    /* Only save accessToken into session */
    cb(null, { accessToken });
  });
};
