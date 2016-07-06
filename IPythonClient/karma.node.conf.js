'use strict';

module.exports = function (karma) {
  karma.set({
    autoWatch: false,
    browserDisconnectTimeout: 1000 * 60 * 2,
    browserNoActivityTimeout: 1000 * 60 * 5,
    colors: true,
    singleRun: true,
    logLevel: karma.LOG_INFO,
    reporters: [
      'mocha'
    ],
    specReporter: {
      suppressErrorSummary: false,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: false,  // do not print information about skipped tests
      showSpecTiming: true // print the time elapsed for each spec
    },
    mochaReporter: {
      showDiff: true
    },
    files: [
      'test/**/*_test.js',
    ],
    frameworks: ['mocha', 'chai'],
    plugins: [
      'karma-mocha-reporter',
      'karma-mocha',
      'karma-chai'
    ]
  });
};
