'use strict';

const expect           = require('chai').expect;
const sinon            = require('sinon');
const childProcess     = require('child_process');
const MockChildProcess = require('./mocks/classes/child-process');
const log              = require('../src/services/log')

const dirname = '../src/services/';
const filename = 'processes';
const lib = require(dirname + filename);

describe(dirname + '/' + filename, function() {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(log);
    sandbox.stub(childProcess);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('create', function() {
    const fn = lib[this.title];

    it('creates', function() {
      const cmd       = 'some command',
            mockChild = new MockChildProcess();

      childProcess.spawn.returns(mockChild);

      expect(fn(cmd)).to.equal(mockChild);
    });
  });

  describe('kill', function() {
    const fn = lib[this.title];

    it('kills', function() {
      const mockChild = new MockChildProcess();

      return fn(mockChild).then(function(result) {
        expect(result).to.deep.equal({ code: 'a', signal: 'b' });
      });
    });
  });
});
