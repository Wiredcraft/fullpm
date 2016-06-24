'use strict';

module.exports = function() {
  return function logout(req, res) {
    if (typeof req.logout === 'function') {
      req.logout();
    }
    if (req.session == null) {
      return res.status(204).end();
    }
    return req.session.regenerate(function(err) {
      return res.status(204).end();
    });
  };
};
