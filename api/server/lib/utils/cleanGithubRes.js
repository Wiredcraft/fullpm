'use strict';

var lib = require('../');
var utils = lib.utils;

module.exports = cleanGithubRes;

/**
 * Helper.
 *
 * Recursively remove some attributes.
 */
function cleanGithubRes(item) {
  if (utils.notObjectOrIsEmpty(item)) {
    return item;
  }
  for (var k in item) {
    var v = item[k];
    if (safeToOmit(v, k)) {
      delete item[k];
    } else if (utils.notEmptyObject(v)) {
      item[k] = cleanGithubRes(v);
    }
  }
  return item;
}

/**
 * Helper.
 */
function safeToOmit(v, k) {
  if (k === 'body') {
    return true;
  }
  if (k === 'avatar_url' || k === 'html_url') {
    return false;
  }
  return k.endsWith('_url');
}
