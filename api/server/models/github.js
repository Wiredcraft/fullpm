'use strict';

// var debug = require('debug')('kenhq:model:github');

var Promise = require('bluebird');

var GithubAPI = require('github-api');
var github = new GithubAPI({});
var issues = Promise.promisifyAll(github.getIssues('pouchdb', 'pouchdb'), {
  // multiArgs: true
});

var defaultColumn = 'backlog';
var defaultRanking = 0;

var lib = require('../lib');
var app = lib.app;
var utils = lib.utils;

module.exports = function(Github) {

  Github.sync = function() {
    var Meta = app.models.Meta;

    return Promise.resolve(issues.listIssuesAsync({})).map(function(issue) {
      // debug('issue', issue);
      return Meta.findById(issue.id).then(function(meta) {
        meta.title = issue.title;
        return meta.save();
      }).catch(function() {
        return Meta.create({
          _id: issue.id,
          url: issue.url,
          title: issue.title,
          column: defaultColumn,
          ranking: defaultRanking
        });
      });
    }).return({}).catch(utils.reject);
  };

  Github.remoteMethod('sync', {
    description: 'Sync',
    http: {
      path: '',
      verb: 'get'
    },
    returns: {
      arg: 'data',
      type: 'object'
    },
    accepts: []
  });

};
