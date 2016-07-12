'use strict';

const expect       = require('chai').expect;
const sinon        = require('sinon');
const EventEmitter = require('events');
const log              = require('../src/services/log')

const dirname        = __dirname.split('/').pop();
const filename = __filename.split('/').pop().split('.').shift();
const lib      = require('./' + filename);

describe(dirname + '/' + filename, function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(log);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('eventsToPromise', function() {
    const fn = lib[this.title];

    it('resolves', function() {
      const emitter = new EventEmitter(),
            data    = 'some data';
      let result;

      result = fn(emitter, { resolve: 'yay', reject: 'booo' }).reflect().then(function(inspection) {
        expect(inspection.value()).to.equal(data);
      });

      emitter.emit('yay', data);

      return result;
    });

    it('rejects', function() {
      const emitter     = new EventEmitter(),
            errorReason = 'some reason',
            error       = new Error(errorReason);
      let result;

      result = fn(emitter, { resolve: 'yay', reject: 'booo' }).reflect().then(function(inspection) {
        expect(inspection.reason()).to.equal(error);
      });

      emitter.emit('booo', error);

      return result;
    });
  });
});
