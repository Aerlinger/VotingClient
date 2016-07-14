'use strict';

const _       = require('lodash');
const log     = require('./util/log').asInternal(__filename);
let outputMap = {};

/**
 *
 * @param {JupyterClient} client
 * @param {JupyterClientResponse} response
 */
function _linkRequestToOutput(client, response) {
  const requestMap = client.requestMap;

  if (!_.isString(response.result)) {
    throw new Error('Expected result to be msg_id of a later response');
  }

  if (!_.isString(response.id)) {
    throw new Error('Expected id to be a key referring to an earlier request');
  }

  requestMap[response.id].msg_id = response.result;
  outputMap[response.result]     = { id: response.id, msg_id: response.result };
}

/**
 * @param {JupyterClient} client
 * @param {*} message
 */
function _requestInputFromUser(client, message) {
  client.emit('input_request', message);
}

function _broadcastKernelStatus(client, message) {
  client.emit('status', message.content.execution_state);
}

/**
 * @param {object} request
 * @param {object} result
 */
function _resolveRequest(request, result) {
  // payload is deprecated, so don't even expose it
  request.deferred.resolve(_.omit(result.content, 'payload', 'engine_info', 'execution_count'));

  // we're done reporting about this topic
  delete outputMap[request.msg_id];
}


/**
 * @param {{status: string, id: string}} obj
 * @returns {boolean}
 */
function _isStartComplete(obj) {
  return obj.status === 'complete' && obj.id === 'startup-complete';
}

/**
 * @param {JupyterClient} client
 * @param {JupyterClientResponse} response
 * @returns {boolean}
 */
function _isRequestToOutputLink(client, response) {
  const requestMap = client.requestMap,
        result     = response.result,
        source     = response.source;

  return !!(source === 'link' && response.id && result && requestMap[response.id]);
}

/**
 * @param {JupyterClientResponse} response
 * @returns {boolean}
 */
function _isExecutionResult(response) {
  const parentMessageId = _.get(response, 'result.parent_header.msg_id'),
        msg_type        = _.get(response, 'result.msg_type'),
        isReply         = msg_type && _.endsWith(msg_type, '_reply');

  if (_.size(outputMap) === 0 && isReply) {
    // log('warn', msg_type, 'without anyone waiting for output', outputMap, response);
  } else if (isReply && !!outputMap[parentMessageId]) {
    // log('warn', msg_type, 'without parent waiting for output', outputMap, response);
  }

  return !!outputMap[parentMessageId];
}

/**
 * @param {{id: string}} parent  Original request
 * @param {{msg_type: string}} child  Resulting action
 * @param {JupyterClient} client  Map of all current requests
 * @returns {boolean}
 */
function _isRequestResolution(parent, child, client) {
  const requestMap = client.requestMap;
  let request      = requestMap[parent.id];

  if (request) {
    if (_.isArray(request.successEvent) && _.includes(request.successEvent, child.msg_type)) {
      return true;
    } else if (request.successEvent === child.msg_type) {
      return true;
    }
  }

  return false;
}

/**
 * @param {string} source
 * @param {{msg_type: string}} child
 * @returns {boolean}
 */
function _isInputRequestMessage(source, child) {
  return source === 'stdin' && child.msg_type === 'input_request';
}

/**
 *
 * @param {JupyterClient} client
 * @param {JupyterClientResponse} response
 */
function _resolveExecutionResult(client, response) {
  const source      = response.source,
        result      = response.result,
        outputMapId = _.get(result, 'parent_header.msg_id');

  let parent    = outputMap[outputMapId],
      child     = _.omit(result, ['msg_id', 'parent_header']),
      requestId = parent.id,
      request   = client.requestMap[requestId];

  child.header = _.omit(child.header, ['version', 'msg_id', 'session', 'username', 'msg_type']);
  if (!parent.header) {
    parent.header = result.parent_header;
  }

  if (_isInputRequestMessage(source, child)) {
    _requestInputFromUser(client, result);
  } else if (_isRequestResolution(parent, child, client)) {
    _resolveRequest(request, result);


  } else if (child.msg_type === 'status') {
    _broadcastKernelStatus(client, result);
  }

  if (!request.hidden) {
    client.emit(response.source, response);
  }
}

/**
 * @param {JupyterClientResponse} response
 * @returns {boolean}
 */
function _isEvalResult(response) {
  const source = response.source;

  return source === 'eval' && _.isString(response.id);
}

/**
 *
 * @param {JupyterClient} client
 * @param {JupyterClientResponse} response
 */
function _resolveEvalResult(client, response) {
  const result  = response.result,
        request = client.requestMap[response.id];

  // payload is deprecated, so don't even expose it
  request.deferred.resolve(result);
}

/**
 * @param {JupyterClient} client
 * @param {JupyterClientResponse} response
 */
function handle(client, response) {
  if (_isStartComplete(response)) {
    client.emit('ready');
  } else if (_isRequestToOutputLink(client, response)) {
    _linkRequestToOutput(client, response);
  } else if (_isExecutionResult(response)) {
    _resolveExecutionResult(client, response);
  } else if (_isEvalResult(response)) {
    _resolveEvalResult(client, response);
  } else if (response.result && response.source) {
    client.emit(response.source, response);
  } else if (response.id && response.result === null) {
    // ignore, they didn't give us a msg_id and that's okay
  } else {
    client.emit('error', new Error('Unknown data object: ' + require('util').inspect(response)));
  }
}

/**
 * @returns {object}
 */
function getOutputMap() {
  // outside people are not allowed to modify this
  return _.cloneDeep(outputMap);
}

function resetOutputMap() {
  outputMap = {};
}

module.exports.handle         = handle;
module.exports.getOutputMap   = getOutputMap;
module.exports.resetOutputMap = resetOutputMap;
