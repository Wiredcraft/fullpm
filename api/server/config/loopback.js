const session = require('express-session');
const RedisStore = require('connect-redis')(session);

module.exports = (app, passport) => {
  const cookieConfig = app.get('cookie');
  const redisConfig = app.get('redis');

  /* Session setting */
  app.middleware('session', session({
    name: 'sid',
    secret: cookieConfig.secret,
    saveUninitialized: false, // No need to save useless session
    resave: true,
    store: new RedisStore({
      host: redisConfig.host,
      port: redisConfig.port
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
    }
  }));

  /* Initial passport session */
  app.use(passport.initialize());
  app.use(passport.session());
};
