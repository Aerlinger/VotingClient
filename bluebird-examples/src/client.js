const _              = require('lodash');
const bluebird       = require('bluebird');
const clientResponse = require('./client-response');
const EventEmitter   = require('events');
const StreamSplitter = require('stream-splitter');
const log            = require('./util/log').asInternal(__filename);
const path           = require('path');
const processes      = require('./services/processes');
const promises       = require('./services/promises');
const pythonLanguage = require('./languages/python');
const uuid           = require('uuid');


/**
 * Listen to JSON stream, emitting once a parseable JSON object has been received
 *
 * @param stream
 * @returns {EventEmitter}
 */
function createObjectEmitter(stream) {
  const streamSplitter = new StreamSplitter('\n');
  const emitter        = new EventEmitter();

  stream          = stream.pipe(streamSplitter);
  stream.encoding = 'utf8';
  stream.on('token', function(token) {
    let obj;

    try {
      obj = JSON.parse(token);  // FIXME: Performance issues here?
      emitter.emit('data', obj);
    } catch(ex) {
      log('error', require('util').inspect(token), ex);
      // we don't have enough data yet, maybe?
    }
  });

  stream.on('error', error => emitter.emit('error', error));

  return emitter;
}

/**
 * @param {JupyterClient} client
 * @param {string} source
 * @param {object} data
 */
function handleProcessStreamEvent(client, source, data) {
  // log('info', 'client event', source, data);

  client.emit('event', source, data);
}


/**
 * @param {JupyterClient} client
 * @param {ChildProcess} child
 */
function listenToChild(client, child) {
  const objectEmitter = createObjectEmitter(child.stdout);

  objectEmitter.on('data', _.partial(clientResponse.handle, client));
  objectEmitter.on('error', _.partial(handleProcessStreamEvent, client, 'objectEmitter.error'));
  objectEmitter.on('end', _.partial(handleProcessStreamEvent, client, 'objectEmitter.end'));

  child.stdout.on('error', _.partial(handleProcessStreamEvent, client, 'stdout.error'));
  child.stderr.on('data', _.partial(handleProcessStreamEvent, client, 'stderr.data'));
  child.stderr.on('error', _.partial(handleProcessStreamEvent, client, 'stderr.error'));

  child.on('error', _.partial(handleProcessStreamEvent, client, 'error'));
}


/**
 * Write object to script.
 * @param {ChildProcess} childProcess
 * @param {object} obj
 * @returns {Promise}
 */
function write(childProcess, obj) {
  return new bluebird(function(resolve, reject) {
    let result = childProcess.stdin.write(JSON.stringify(obj) + '\n', function(error) {
      if (!result) {
        reject(new Error('Unable to write to stdin'));
      } else if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}


/**
 * @param {JupyterClient} client
 * @param {object} invocation
 * @param {string} invocation.method
 * @param {Array} [invocation.args]
 * @param {object} [invocation.kwargs]
 * @param {string} [invocation.target]
 * @param {object} options
 * @param {string|string[]} options.successEvent
 * @returns {Promise}
 */
function request(client, invocation, options) {
  const childProcess  = client.childProcess,
        requestMap    = client.requestMap,
        id            = uuid.v4().toString(),
        inputPromise  = write(childProcess, _.assign({ id }, invocation)),
        successEvent  = options.successEvent,
        hidden        = options.hidden,
        startTime     = new Date().getTime(),
        outputPromise = new Promise(function(resolve, reject) {
          requestMap[id] = { id, invocation, successEvent, hidden, deferred: { resolve, reject } };
        });

  return inputPromise
    .then(() => outputPromise)
    .finally(function() {
      const endTime = (new Date().getTime() - startTime) + 'ms';

      // log('info', 'request', invocation, endTime);

      // clean up reference, no matter what the result
      delete requestMap[id];
    });
}

/**
 * @class JupyterClient
 */
class JupyterClient extends EventEmitter {
  constructor(child) {
    super();
    this.childProcess = child;
    this.requestMap   = {};

    listenToChild(this, child);
  }

  /**
   * @param {string} code
   * @param {object} [args]
   * @param {boolean} [args.silent]
   * @param {boolean} [args.storeHistory]
   * @param {object} [args.userExpressions]
   * @param {boolean} [args.allowStdin]
   * @param {boolean} [args.stopOnError]
   * @returns {Promise<object>}
   */
  execute(code, args) {
    return request(this, {
      method: 'execute',
      kwargs: _.assign({ code }, pythonLanguage.toPythonArgs(args))
    }, { successEvent: 'execute_reply' });
  }

  /**
   * Respond to a request for input from the kernel
   * @param {string} str
   * @returns {Promise}
   */
  input(str) {
    return request(this, { method: 'input', args: [str] }, { successEvent: 'execute_reply' });
  }

  interrupt() {
    const id     = uuid.v4().toString(),
          target = 'manager',
          method = 'interrupt_kernel';

    return write(this.childProcess, { method, target, id });
  }

  /**
   * @param {string} code
   * @param {object} [args]
   * @param {boolean} [args.silent]
   * @param {boolean} [args.storeHistory]
   * @param {object} [args.userExpressions]
   * @param {boolean} [args.allowStdin]
   * @param {boolean} [args.stopOnError]
   * @returns {Promise<object>}
   */
  getResult(code, args) {
    return request(this, {
      method: 'execute',
      kwargs: _.assign({ code }, pythonLanguage.toPythonArgs(args))
    }, {
      successEvent: ['execute_result', 'display_data', 'stream'],
      emitOnly:     []
    });
  }

  /**
   * @param {string} str
   * @returns {Promise}
   */
  getEval(str) {
    return request(this, {
      exec_eval: str
    }, { successEvent: ['eval_results'] });
  }

  getDocStrings(names) {
    console.log()
    const code = '__get_docstrings(globals(), ' + JSON.stringify(names) + ', False)';
    const args = {
      allowStdin:  false,
      stopOnError: true
    };

    return request(this, {
      method: 'execute',
      kwargs: _.assign({ code }, pythonLanguage.toPythonArgs(args))
    }, {
      successEvent: ['stream'],
      hidden:       true
    });
  }

  getVariables() {
    const code = '__get_variables(globals())',
          args = {
            allowStdin:  false,
            stopOnError: true
          };

    return request(this, {
      method: 'execute',
      kwargs: _.assign({ code }, pythonLanguage.toPythonArgs(args))
    }, {
      successEvent: ['stream'],
      hidden:       true
    }).then(function(result) {
      return JSON.parse(result.text);
    });
  }

  /**
   * @typedef {object} JupyterAutoCompletionMessage
   * @property {'ok'|'error'} status
   * @property {Array} matches
   * @property {number} cursorStart
   * @property {number} cursorEnd
   * @property {object} metadata
   */

  /**
   *
   *
   * We send msg_type: complete_request
   * We get msg_type: complete_reply with content of
   *   {status: ok|error, matches: Array, cursorStart: number, cursorEnd: number, metadata: map}
   * @param {string} code
   * @param {number} cursorPos
   * @returns {Promise<JupyterAutoCompletionMessage>}
   */
  getAutoComplete(code, cursorPos) {
    return request(this, {
      method: 'complete', // sends complete_request
      args:   [code, cursorPos]
    }, { successEvent: 'complete_reply' });
  }

  /**
   * @typedef {object} JupyterInspectionMessage
   * @property {'ok'|'error'} status
   * @property {bool} found
   * @property {object} data
   * @property {object} metadata
   */

  /**
   * @param {string} code
   * @param {number} cursorPos
   * @param {number} [detailLevel=0]  Equivalent in python would be 0 is x?, 1 is x??
   * @returns {Promise<JupyterInspectionMessage>}
   */
  getInspection(code, cursorPos, detailLevel) {
    detailLevel = detailLevel || 0;

    return request(this, {
      method: 'inspect', // sends inspect_request
      args:   [code, cursorPos, detailLevel]
    }, { successEvent: 'inspect_reply' });
  }

  /**
   * @typedef {object} JupyterCodeIsCompleteMessage
   * @property {'complete'|'incomplete'|'invalid'|'unknown'} status
   * @property {string} indent  Only for incomplete status
   */

  /**
   * Is code likely to run successfully?
   *
   * @param {string} code
   * @returns {Promise<JupyterCodeIsCompleteMessage>}
   */
  isComplete(code) {
    return request(this, {
      method: 'is_complete', // sends is_complete_request
      args:   [code]
    }, { successEvent: 'is_complete_reply' });
  }

  /**
   * @returns {Promise}
   */
  kill() {
    return processes.kill(this.childProcess);
  }
}


/**
 * @param {object} [options]
 * @returns {object}
 */
function _getPythonCommandOptions(options) {
  options = _resolveHomeDirectory(options);

  return _.assign({
    env:      pythonLanguage.setDefaultEnvVars(process.env),
    stdio:    ['pipe', 'pipe', 'pipe'],
    encoding: 'UTF8'
  }, _.pick(options || {}, ['shell']));
}

/**
 * @param {string} targetFile
 * @param {object} [options]
 * @param {string} [options.shell=<default for OS>]
 * @param {string} [options.cmd="python"]
 * @returns {ChildProcess}
 */
function _createPythonScriptProcess(targetFile, options) {
  options = _.pick(options || {}, ['shell', 'cmd']);

  const processOptions = _getPythonCommandOptions(options);
  const cmd            = options.cmd || 'python';

  return processes.create(cmd, [targetFile], processOptions);
}

/**
 * @param {object} options
 * @returns {object}  Modified options
 */
function _resolveHomeDirectory(options) {
  if (options && options.cmd && (_.startsWith(options.cmd, '~') || _.startsWith(options.cmd, '%HOME%'))) {
    const home = require('os').homedir();

    options.cmd = options.cmd.replace(/^~/, home).replace(/^%HOME%/, home);
  }

  return options;
}

/**
 * @param {object} options
 * @returns {Promise<JupyterClient>}
 */
function create(options) {
  const targetFile = path.resolve('./bin/start_kernel.py');

  return bluebird.try(function() {
    const child  = _createPythonScriptProcess(targetFile, options),
          client = new JupyterClient(child);

    return promises.eventsToPromise(client, { resolve: 'ready', reject: 'error' })
                   .then(_.constant(client));
  });
}

/**
 * Runs a script in python, returns the output with errors and stderr rejecting the results
 * @param {string} targetFile
 * @param {object} [options]
 * @returns {Promise}
 */
function getPythonScriptResults(targetFile, options) {
  const processOptions = _getPythonCommandOptions(options),
        cmd            = options.cmd || 'python';

  return processes.exec(cmd, [targetFile], processOptions);
}

/**
 * @param {object} options
 * @returns {Promise}
 */
function checkPython(options) {
  const targetFile = path.resolve('./bin/check_python.py');

  return exports.getPythonScriptResults(targetFile, options)
                .then(JSON.parse)
                .then(function(pythonOptions) {
                  return _.assign({}, pythonOptions, options);
                })
                .timeout(10000, 'Unable to check python in under 10 seconds: ' + JSON.stringify(options));
}

module.exports.create                 = create;
module.exports.getPythonScriptResults = getPythonScriptResults;
module.exports.checkPython            = checkPython;