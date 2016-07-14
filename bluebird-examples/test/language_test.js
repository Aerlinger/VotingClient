'use strict';

const sinon = require('sinon');

const dirname = '../src/languages/';
const filename = 'python';
const lib = require(dirname + filename);
import { expect} from 'chai';

describe(dirname + '/' + filename, function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('toPythonArgs', function () {
    const fn = lib[this.title];

    it('converts', function () {
      const data = {a: 'b', cD: 'e', fgHi: 'j'},
            expectedResult = {a: 'b', c_d: 'e', fg_hi: 'j'};

      let result = fn(data)

      expect(result).to.deep.equal(expectedResult);
    });
  });

  describe('setDefaultEnvVars', function () {
    const fn = lib[this.title];

    it('removes buffering', function () {
      const data = {};

      let result = fn(data);

      expect(result).to.have.property('PYTHONUNBUFFERED');
    });
  });
});


