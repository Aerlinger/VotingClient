'use strict';

// mocha --compilers js:babel-core/register  --require ./test/test_helper.js  --recursive

import AsciiToHtml from 'ansi-to-html';
import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';

const example1 = fs.readFileSync(path.resolve('./test/mocks/jupyter_examples/example_1.py'), { encoding: 'UTF8' });
// const example2 = fs.readFileSync(path.resolve('./test/mocks/jupyter_examples/example_2.py'), { encoding: 'UTF8' });
// const example3 = fs.readFileSync(path.resolve('./test/mocks/jupyter_examples/example_3.py'), { encoding: 'UTF8' });
// const example4 = fs.readFileSync(path.resolve('./test/mocks/jupyter_examples/example_4.py'), { encoding: 'UTF8' });
// const example5 = fs.readFileSync(path.resolve('./test/mocks/jupyter_examples/example_5.py'), { encoding: 'UTF8' });

const sinon = require('sinon');

import { create, checkPython } from '../src/client';
const processes = require('../src/services/processes');


describe("Jupyter Client Kernel", function() {
  let sandbox;
  let client

  before(function(done) {
    this.timeout(10000);
    sandbox = sinon.sandbox.create();

    create()
      .then((spawnedClient) => {
        client = spawnedClient
        done()
      })
  });

  after(function() {
    this.timeout(10000);
    if (client) {
      return client.kill();
    }

    sandbox.restore();
  });

  describe("initial state", () => {
    it('application process has one child process for the created kernel', () => {
      expect(processes.getChildren().length).to.equal(1);
    });

    it('has an initially empty requestMap', () => {
      expect(client.requestMap).to.eql({})
    });

    it('has no child processes', () => {
      expect(client.children).to.eql(undefined)
    });
  });

  describe("Simple evaluation via `getEval`", () => {
    it("`[]`", (done) => {
      client.getEval("[]")
            .then((res) => {
              console.log(res)

              expect(res).to.eql([])
              done()
            })
    });

    it("`{}`", (done) => {
      client.getEval("{}")
            .then((res) => {
              console.log(res)

              expect(res).to.eql({})
              done()
            })
    });

    it("`7 + 49`", (done) => {
      client.getEval("7 + 49")
            .then((res) => {
              console.log(res)

              expect(res).to.eql(56)
              done()
            })
    });

    it("`dict()`", (done) => {
      client.getEval("dict()")
            .then((res) => {
              console.log(res)

              expect(res).to.eql({})
              done()
            })
    });

    it("`dict()`", (done) => {
      client.getEval("dict()")
            .then((res) => {
              console.log(res)

              expect(res).to.eql({})
              done()
            })
    });

    it("`set([1, 1, 1, 2, 3])`", (done) => {
      client.getEval("[1, 1, 1, 2, 3]")
            .then((res) => {
              console.log(res)

              expect(res).to.eql([1, 1, 1, 2, 3])
              done()
            })
            .catch((res) => {
              console.log(res)
              expect(res).to.eql("???")
              done()
            })
    });


    it("`3<3<3", (done) => {
      client.getEval("3<3<3")
            .then((res) => {
              console.log(res)

              expect(res).to.eql(false)
              done()
            })
    });

    it(`"Nested 'strings'"`, (done) => {
      client.getEval(`"Nested 'strings'"`)
            .then((res) => {
              expect(res).to.eql("Nested 'strings'")
              done()
            })
    });

  });

  describe("execute", () => {
    it("executes non-serializable expression: `set([1, 1, 1, 2, 3])`", (done) => {
      client.execute("set([1, 1, 1, 2, 3])")
            .then((res) => {
              console.log(res)

              expect(res).to.eql({ status: "ok", user_expressions: {} })
              done()
            })
    });

    it("can handle failure", (done) => {
      client.execute("raise")
            .then((res) => {
              expect(res['status']).to.eq("error")
              expect(res['ename']).to.eq("TypeError")

              done()
            })
    });

    it("can return a result", (done) => {
      const expectedResult = { status: 'ok', user_expressions: {} };

      client.on('input_request', function() {
        console.log("Input requs!")
        client.input('stuff!');
      });

      return client.execute("1+1").then(function(result) {
        expect(result).to.deep.equal(expectedResult);

        done()
      });
    })

  });

  describe("getResult", () => {
    it("can return a result", (done) => {
      return client.getResult("5 ** 2").then(function(result) {
        let raw_result = result['data']['text/plain']

        expect(raw_result).to.eql("25");

        done()
      });
    })
  })

  describe("`checkPython`", () => {
    it("Checks Python version and environment info `checkPython`", () => {
      return checkPython({})
        .then((res) => {
          let { executable, hasJupyterKernel, packages, version } = res

          expect(hasJupyterKernel).to.eql(true)
          expect(executable).to.have.string("python")
          expect(version).to.have.string("2.7.11")
        });
    })
  })

  describe("`getDocStrings`", () => {

    it('gets docstrings when empty list', function(done) {
      this.timeout(10000);
      client.getDocStrings([]).then(function(result) {
        expect(result).to.deep.equal({
          name: 'stdout',
          text: '[]\n'
        });

        done();
      });
    });

    it('gets docstrings with global names', function() {
      this.timeout(10000);
      client.getDocStrings(['sys']).then(function(result) {
        expect(result).to.deep.equal({
          name: 'stdout',
          text: '[{\"text\": \"sys\", \"docstring\": \"no docstring provided\", \"dtype\": \"---\"}]\n'
        });
      });
    });

    it("gets a simple docstring for dict", (done) => {
      client.getDocStrings([`dict`])
            .then(function(result) {
              expect(result.text).to.have.string("new dictionary initialized from a mapping object")

              done()
            });
    });

  });

  describe("`getVariables`", () => {
    it('gets variables when empty', function() {
      this.timeout(10000);
      return client.getVariables([]).then(function(result) {
        expect(result).to.deep.equal({
          function:  [],
          Series:    [],
          list:      [],
          DataFrame: [],
          other:     [],
          dict:      [],
          ndarray:   []
        });
      });
    })

    it('gets variables when NOT empty', function() {
      const convert   = new AsciiToHtml(),
            code      = 'obj_or_dict = {"akey": "value", "another": "value2"}',
            cursorPos = 0;

      return client.execute(code).then(function() {
        return client.getVariables([]);
      }).then(function(result) {
        expect(result).to.deep.equal({
          function:  [],
          Series:    [],
          list:      [],
          DataFrame: [],
          other:     [],
          dict:      [{
            "name": "obj_or_dict",
            "repr": "Dict with 2 keys"
          }],
          ndarray:   []
        });
      });
    })
  })

  describe("`getAutoComplete`", () => {
    it('recognizes "print"', function() {
      const code      = 'print "Hello"',
            cursorPos = 4;

      return client.getAutoComplete(code, cursorPos).then(function(result) {
        expect(result).to.deep.equal({
          matches:      ['print'],
          status:       'ok',
          cursor_start: 0,
          cursor_end:   4,
          metadata:     {}
        });
      });
    });

    it('recognizes "class"', function() {
      const code      = 'class Hello',
            cursorPos = 4;

      return client.getAutoComplete(code, cursorPos).then(function(result) {
        expect(result).to.deep.equal({
          matches:      ['class', 'classmethod'],
          status:       'ok',
          cursor_start: 0,
          cursor_end:   4,
          metadata:     {}
        });
      });
    });

    it('recognizes "sorted"', function() {
      const code      = 'sorte',
            cursorPos = 4;

      return client.getAutoComplete(code, cursorPos).then(function(result) {
        expect(result).to.deep.equal({
          matches:      ['sorted'],
          status:       'ok',
          cursor_start: 0,
          cursor_end:   4,
          metadata:     {}
        });
      });
    })

    it('recognizes "pd.DataFrame"', function() {
      const code      = 'import pandas as pd;pd.DataFra',
            cursorPos = 30;

      return client.getAutoComplete(code, cursorPos).then(function(result) {
        expect(result).to.deep.equal({
          matches:      ['pd.DataFrame'],
          status:       'ok',
          cursor_start: 20,
          cursor_end:   30,
          metadata:     {}
        });
      });
    })

  });

  describe("`getInspection`", () => {
    it('inspects a dictionary', function() {
      const convert   = new AsciiToHtml(),
            code      = 'obj_or_dict = {"akey": "value", "another": "value2"}',
            cursorPos = 0;

      return client.execute(code).then(function() {

        let inspection = client.getInspection(code, cursorPos);


        return inspection
      }).then(function(result) {
        const text = convert.toHtml(result.data['text/plain']);

        expect(result).to.have.property('status', 'ok');
        expect(result).to.have.property('found', true);
        expect(text).to.match(/Type:/);
        expect(text).to.match(/String form:/);
        expect(text).to.match(/Length:/);
        expect(text).to.match(/Docstring:/);
      });
    });

    it('inspects "pd.DataFrame"', function() {
      const code      = 'import pandas as pd;pd.DataFrame()',
            convert   = new AsciiToHtml(),
            cursorPos = 33;

      return client.execute(code)
                   .then(function() {
                     return client.getInspection(code, cursorPos)
                   })
                   .then(function(inspection_result) {
                     let inspection_html = convert.toHtml(inspection_result.data['text/plain']);
                     console.log("RAW: ", inspection_result)
                     console.log("HTML: ", inspection_html)
                     expect(inspection_result["found"]).to.eql(true)
                     expect(inspection_result["data"]["text/plain"]).to.have.string("DataFrame.from_dict")
                   });
    })
  })

  describe("`isComplete`", () => {
    it('print "Hello" is complete with no extra information', function() {
      const code = 'print "Hello"';

      return client.isComplete(code).then(function(result) {
        expect(result).to.deep.equal({ status: 'complete' });
      });
    });

    it('print "Hello is invalid with no extra information', function() {
      const code = 'print "Hello';

      return client.isComplete(code).then(function(result) {
        expect(result).to.deep.equal({ status: 'invalid' });
      });
    });

    it('x = range(10 is incomplete with empty indent', function() {
      const code = 'x = range(10';

      return client.isComplete(code).then(function(result) {
        expect(result).to.deep.equal({ status: 'incomplete', indent: '' });
      });
    });
  })

  it("current execution can be interrupted")
  it("manages a request map for routing")
  it("gets an inspection of the current input")
  it("executes a file")
  it("gets a result of executing a file `getPythonScriptResults`")
})