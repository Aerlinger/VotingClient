const karma = require('karma');
const KarmaServer = karma.Server;

/**
 *
 * @param {string} configFile
 * @returns {Promise}
 */
function runKarma(configFile) {
  return new Promise(function (resolve, reject) {
    const server = new KarmaServer({
      configFile: path.join(__dirname, configFile),
      singleRun: true
    }, function (result) {
      if (result > 0) {
        return reject(new Error(`Karma exited with status code ${result}`));
      }

      resolve();
    });

    server.start();
  });
}

runKarma('karma.node.conf.js')
