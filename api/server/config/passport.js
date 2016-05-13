var githubStrategy = require('./strategy/github');

module.exports = (app, passport) => {
  /* Load github strategy for passport */
  passport.use(githubStrategy(app));

  /**
   * Serialize and deserilize
   * accessToken then can be got from req.user.accessToken
   */
  passport.serializeUser((user, done) => done(null, user));

  passport.deserializeUser((user, done) => done(null, user));
};
