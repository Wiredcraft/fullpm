'use strict';

var debug = require('debug')('kenhq:model:repo');

var util = require('util');
var Joi = require('joi');
var moment = require('moment');
var Promise = require('bluebird');
var GithubAPI = require('github-api');

var lib = require('../lib');
var app = lib.app;
var utils = lib.utils;

// The repo object from Github.
var schemaRepo = Joi.object({
  owner: Joi.object({
    login: Joi.string().trim().lowercase()
  }),
  full_name: Joi.string().trim().lowercase()
}).strict(false);

var namePattern = '%s/github/%s';

var defaultColumn = 0;
var defaultRanking = 0;

module.exports = function(GithubRepo) {

  GithubRepo.getFullName = utils.valueObtainer('getFullName', schemaRepo, 'full_name');

  GithubRepo.getOwnerName = utils.valueObtainer('getOwnerName', schemaRepo, 'owner.login');

  GithubRepo.setAttributes = function(data) {
    return Promise.join(GithubRepo.getFullName(data), GithubRepo.getOwnerName(data),
      function(fullName, owner) {
        return Object.assign(data, {
          // ID is based on the names.
          id: fullName,
          owner: owner,
          cachedAt: moment().format()
        });
      });
  };

  /**
   * Prototypes.
   */

  GithubRepo.prototype.ensureDataSource = function(BaseModel) {
    var settings = BaseModel.getDataSource().settings;
    // We use DB name as the DS name so it's easier to be matched.
    var name = util.format(namePattern, settings.database, this.getId());
    var dataSource = app.dataSources[name];
    if (dataSource != null) {
      return Promise.resolve(dataSource);
    }
    dataSource = app.dataSource(name, Object.assign({}, settings, {
      name: name,
      database: name
    }));
    return Promise.resolve(dataSource);
  };

  GithubRepo.prototype.ensureChildModel = function(BaseModel) {
    var name = util.format(namePattern, BaseModel.modelName, this.getId());
    var ChildModel = app.models[name];
    if (ChildModel != null) {
      return Promise.resolve(ChildModel);
    }
    return this.ensureDataSource(BaseModel).then(function(dataSource) {
      ChildModel = BaseModel.extend(name);
      ChildModel = app.model(ChildModel, { dataSource: dataSource.settings.name });
      return Promise.resolve(dataSource.autoupdate()).return(ChildModel);
    });
  };

  GithubRepo.prototype.ensureMeta = function() {
    var repo = this;
    return this.ensureChildModel(app.models.Meta).then(function(Model) {
      // Using DB URL directly for now.
      // TODO: generate routers dynamically.
      var dataSource = Model.getDataSource();
      return dataSource.connector.getDbUrl().then(function(dbUrl) {
        repo.metaDB = dbUrl.replace(dataSource.settings.url, app.get('dbProxyRoot'));
        return Model;
      });
    });
  };

  GithubRepo.prototype.ensureCache = function() {
    var repo = this;
    return this.ensureChildModel(app.models.Cache).then(function(Model) {
      var dataSource = Model.getDataSource();
      return dataSource.connector.getDbUrl().then(function(dbUrl) {
        repo.cacheDB = dbUrl.replace(dataSource.settings.url, app.get('dbProxyRoot'));
        return Model;
      });
    });
  };

  GithubRepo.prototype.syncIssues = function(github, Meta, Cache) {
    var issues = Promise.promisifyAll(github.getIssues(this.owner, this.name));
    // TODO: get closed issues.
    return issues.listIssuesAsync({}).map(function(issue) {
      // Save meta.
      return Meta.findById(issue.id).then(function(meta) {
        if (meta) {
          return issue;
        }
        debug('saving new meta');
        return Promise.resolve(Meta.create({
          id: issue.id,
          column: defaultColumn,
          ranking: defaultRanking
        })).return(issue);
      });
    }).map(function(issue) {
      // Save cache.
      return Cache.findById(issue.id).then(function(meta) {
        if (meta) {
          // TODO: may update at some point.
          return issue;
        }
        debug('saving new cache');
        return Promise.resolve(Cache.create({
          id: issue.id,
          url: issue.url,
          htmlUrl: issue.html_url,
          number: issue.number,
          title: issue.title,
          createdAt: issue.created_at,
          updatedAt: issue.updated_at,
          cachedAt: moment().format()
        })).return(issue);
      });
    }).return(this);
  };

  /**
   * Remote methods.
   */

  /**
   * Repo is auto-created as long as the requesting user has the view access.
   */
  GithubRepo.findByFullname = function(req, orgName, repoName) {
    debug('finding repo %s/%s', orgName, repoName);
    var options = {};
    if (req.user != null && req.user.accessToken != null) {
      options.token = req.user.accessToken;
    }
    var github = new GithubAPI(options);

    function syncIssues(repo) {
      return Promise.join(github, repo.ensureMeta(), repo.ensureCache(), repo.syncIssues.bind(repo));
    }

    var repoAPI = Promise.promisifyAll(github.getRepo(orgName, repoName));
    return repoAPI.getDetailsAsync()
      .catchReturn(utils.reject(404)) // TODO: more details?
      .then(GithubRepo.setAttributes)
      .then(function(data) {
        return GithubRepo.findById(data.id).then(function(repo) {
          if (repo == null) {
            // Create.
            debug('creating:', data.id);
            var promise = GithubRepo.create(data);
            // Sync on the side.
            promise.then(syncIssues);
          } else if (repo.cachedAt == null || moment().diff(moment(repo.cachedAt)) > 10000) {
            // Replace.
            debug('updating:', data.id);
            var promise = GithubRepo.replaceById(data.id, data);
            // Sync on the side.
            promise.then(syncIssues);
          } else {
            debug('skipping:', data.id);
            var promise = repo;
          }
          return promise;
        });
      })
      .catch(utils.reject);
  };

  /**
   * @example http://127.0.0.1:3000/api/repos/github/pouchdb/pouchdb
   */
  GithubRepo.remoteMethod('findByFullname', {
    description: '',
    http: {
      path: '/:orgName/:repoName',
      verb: 'get'
    },
    returns: {
      arg: 'data',
      type: 'object'
    },
    accepts: [{
      arg: 'req',
      type: 'object',
      http: { source: 'req' }
    }, {
      arg: 'orgName',
      type: 'string',
      required: true
    }, {
      arg: 'repoName',
      type: 'string',
      required: true
    }]
  });

};
