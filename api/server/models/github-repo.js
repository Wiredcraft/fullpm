'use strict';

const debug = require('debug')('fullpm:model:repo');

const util = require('util');
const Joi = require('joi');
const moment = require('moment');
const Promise = require('bluebird');
const GithubAPI = require('github-api');
const httpError = require('http-errors');

const lib = require('../lib');
const app = lib.app;
const utils = lib.utils;

// The repo object from Github.
const schemaRepo = Joi.object({
  id: Joi.number(),
  owner: Joi.object({
    login: Joi.string().trim().lowercase()
  }),
  name: Joi.string().trim().lowercase(),
  full_name: Joi.string().trim().lowercase()
}).strict(false);

const namePattern = '%s/github/%s';

const cacheTTL = 10000;

const defaultColumn = 0;
// const defaultRanking = 0;

module.exports = function(GithubRepo) {

  GithubRepo.getId = utils.valueObtainer('getId', schemaRepo, 'id');

  GithubRepo.getOwner = utils.valueObtainer('getOwner', schemaRepo, 'owner.login');

  GithubRepo.getName = utils.valueObtainer('getName', schemaRepo, 'name');

  GithubRepo.setAttributes = function(data) {
    return Promise.join(GithubRepo.getId(data), GithubRepo.getOwner(data), GithubRepo.getName(data),
      (id, owner, name) => {
        return Object.assign(data, {
          // Owner and name are lowercased.
          id: id,
          owner: owner,
          name: name,
          cachedAt: moment().format()
        });
      });
  };

  /**
   * Prototypes.
   */

  GithubRepo.prototype.ensureDataSource = function(BaseModel) {
    const settings = BaseModel.getDataSource().settings;
    // We use DB name as the DS name so it's easier to be matched.
    const name = util.format(namePattern, settings.database, this.getId());
    if (app.dataSources[name] != null) {
      return Promise.resolve(app.dataSources[name]);
    }
    app.dataSources[name] = app.dataSource(name, Object.assign({}, settings, {
      name: name,
      database: name
    }));
    return Promise.resolve(app.dataSources[name]);
  };

  GithubRepo.prototype.ensureChildModel = function(BaseModel) {
    const name = util.format(namePattern, BaseModel.modelName, this.getId());
    if (app.models[name] != null) {
      return Promise.resolve(app.models[name]);
    }
    return this.ensureDataSource(BaseModel).then((dataSource) => {
      const ChildModel = BaseModel.extend(name);
      app.models[name] = app.model(ChildModel, { dataSource: dataSource.settings.name });
      return Promise.resolve(dataSource.autoupdate()).return(app.models[name]);
    });
  };

  GithubRepo.prototype.ensureMeta = function() {
    return this.ensureChildModel(app.models.Meta).then((Model) => {
      // Using DB URL directly for now.
      // TODO: generate routers dynamically.
      const dataSource = Model.getDataSource();
      return dataSource.connector.getDbUrl().then((dbUrl) => {
        this.metaDB = dbUrl.replace(dataSource.settings.url, app.get('dbProxyRoot'));
        return Model;
      });
    });
  };

  GithubRepo.prototype.ensureCache = function() {
    return this.ensureChildModel(app.models.Cache).then((Model) => {
      const dataSource = Model.getDataSource();
      return dataSource.connector.getDbUrl().then((dbUrl) => {
        this.cacheDB = dbUrl.replace(dataSource.settings.url, app.get('dbProxyRoot'));
        return Model;
      });
    });
  };

  GithubRepo.prototype.syncIssues = function(github, Meta, Cache) {
    const issues = Promise.promisifyAll(github.getIssues(this.owner, this.name));
    // TODO: get closed issues.
    return issues.listIssuesAsync({}).map((issue) => {
      // Save meta.
      return Meta.findById(issue.id).then((meta) => {
        if (meta) {
          return issue;
        }
        debug('saving new meta');
        return Promise.resolve(Meta.create({
          id: issue.id,
          column: defaultColumn,
          ranking: issue.number
        })).return(issue);
      });
    }).map((issue) => {
      // Save cache.
      return Cache.findById(issue.id).then((meta) => {
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
          assignees: issue.assignees || [],
          comments: issue.comments,
          cachedAt: moment().format()
        })).return(issue);
      });
    }).return(this);
  };

  /**
   * Access control.
   */

  /**
   * Is user an assignee.
   */
  GithubRepo.prototype.isAssignee = function(user) {
    if (this.assignees == null) {
      return Promise.reject(httpError(403));
    }
    return Promise.filter(this.assignees, (assignee) => {
      return assignee.id === user.id;
    }).then((res) => {
      if (res[0] == null) {
        throw httpError(403);
      }
      return user;
    });
  };

  /**
   * Is writable by a user.
   */
  GithubRepo.prototype.isWritable = function(user) {
    // Block if no owner.
    if (this.owner == null || user == null || user.login == null) {
      return Promise.reject(httpError(403));
    }
    // Pass if user is owner.
    if (user.login.toLowerCase() === this.owner) {
      return Promise.resolve(true);
    }
    // Pass if user is an assignee.
    return this.isAssignee(user);
  };

  /**
   * Is readable by a user.
   */
  GithubRepo.prototype.isReadable = function(user) {
    // TODO
  };

  /**
   * Remote methods.
   */

  /**
   * Repo is auto-created as long as the requesting user has the view access.
   */
  GithubRepo.findByFullname = function(req, orgName, repoName) {
    debug('finding repo %s/%s', orgName, repoName);
    let options = {};
    if (req.user != null && req.user.accessToken != null) {
      options.token = req.user.accessToken;
    }
    const github = new GithubAPI(options);

    // TODO: ugly.
    function syncIssues(repo) {
      return Promise.join(github, repo.ensureMeta(), repo.ensureCache(), repo.syncIssues.bind(repo));
    }

    const repoAPI = Promise.promisifyAll(github.getRepo(orgName, repoName));
    repoAPI._requestAsync = Promise.promisify(repoAPI._request);
    return repoAPI.getDetailsAsync()
      .catchReturn(utils.reject(404)) // TODO: more details?
      .then(GithubRepo.setAttributes)
      .then((data) => {
        // Get assignees.
        return repoAPI._requestAsync('GET', `/repos/${repoAPI.__fullname}/assignees`, null)
          .map(utils.cleanGithubRes)
          .then((assignees) => {
            data.assignees = assignees;
            return data;
          });
      })
      .then((data) => {
        return GithubRepo.findById(data.id).then((repo) => {
          let promise;
          if (repo == null) {
            // Create.
            debug('creating:', data.full_name);
            promise = GithubRepo.create(data).then((repo) => {
              return Promise.join(repo.ensureMeta(), repo.ensureCache(), () => repo);
            });
            // Sync on the side.
            promise.then(syncIssues);
          } else if (repo.cachedAt == null || moment().diff(moment(repo.cachedAt)) > cacheTTL) {
            // Replace.
            debug('updating:', data.full_name);
            promise = GithubRepo.replaceById(data.id, data).then((repo) => {
              return Promise.join(repo.ensureMeta(), repo.ensureCache(), () => repo);
            });
            // Sync on the side.
            promise.then(syncIssues);
          } else {
            debug('skipping:', data.full_name);
            promise = Promise.join(repo.ensureMeta(), repo.ensureCache(), () => repo);
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
