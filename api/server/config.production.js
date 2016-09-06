'use strict';

const env = process.env;

module.exports = {
  session: {
    secret: env.FULLPM_SESSION_SECRET || 'super mario'
  },
  auth: {
    baseURL: env.FULLPM_BASEURL || 'http://127.0.0.1:3000',
    github: {
      scope: env.FULLPM_GITHUB_SCOPE || 'user:email,read:org,repo,notifications',
      clientID: env.FULLPM_GITHUB_CLIENT,
      clientSecret: env.FULLPM_GITHUB_SECRET
    }
  }
};
