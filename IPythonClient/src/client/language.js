/**
 * Things related directly to the format of the language interpreters or language
 * @module
 */

'use strict';

const _  = require('lodash');
const fs = require('fs');

/**
 * @param {object} args
 * @returns {object}
 */
function toPythonArgs(args) {
  return _.reduce(args, function(obj, value, key) {
    obj[_.snakeCase(key)] = value;
    console.log("PYTHON ARGS");
    console.log(obj);
    return obj;
  }, {});
}

function addPath(envs, path) {
  if (!_.includes(envs, path) && fs.existsSync(path)) {
    envs.push(path);
  }
}

function setDefaultEnvVars(env) {
  if (process.platform === 'darwin' && _.isString(env.PATH)) {
    if (_.isString(env.PATH)) {
      const envs = env.PATH.split(':');

      addPath(envs, '/Users/Aerlinger/.pyenv/shims');
      // addPath(envs, '/sbin');
      // addPath(envs, '/usr/sbin');
      // addPath(envs, '/usr/local/bin');

      env.PATH = envs.join(':');
    }
  }

  return _.assign({
    PYTHONUNBUFFERED: '1'
  }, env);
}

module.exports.toPythonArgs      = toPythonArgs;
module.exports.setDefaultEnvVars = setDefaultEnvVars;
