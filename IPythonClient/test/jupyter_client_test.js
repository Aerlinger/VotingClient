import { expect } from 'chai';
import { spawn } from 'child_process';
import _ from 'lodash'

import uuid from 'uuid'

import { create, getPythonScriptResults } from '../src/client'
// import { JupyterClient, createPythonScriptProcess } from '../../../lib/main/client'
import { log, asInternal } from '../src/services/log'

const processes     = require('../src/services/processes');

asInternal(__filename)


describe("Client Sample", function() {
  this.timeout(10000)

  let kernelProc;
  let client;

  before((done) => {
    // const child  = createPythonScriptProcess(targetFile, options)
    // kernelProc = create("python", ["./test/fixtures/kernel/start_kernel.py"])
    // client = new JupyterClient(kernelProc);
    create().then(function(jupyterClient) {
      client = jupyterClient
      console.log("READYs")
      done()

      client.on("ready", function(res) {

        console.log("READY RECV")
      })

    });

    /*

    kernelProc.stderr.on('data', function(data) {
      console.error('STDERR:', data.toString())
    })

    kernelProc.stdout.on('data', function(data) {
      // log("info", "STDOUT", data.toString())
      // console.log( JSON.parse(data.toString()) )
    })
    */

    /*
    kernelProc.stdin.on('data', function(data) {
      console.log('STDIN:', data.toString())
    })
    */
  })

  after((done) => {
    client.kill().then(function({ code, signal }) {
      log("KILLING PID", code, signal)
      done()
    })
  })

  it("spawns a single child process", function() {
    expect(processes.getChildren().length).to.eql(1)
  })

  it("performs simple eval", function(done) {
    client.getEval("113 + 6").then(function(result) {
      expect(result).to.eql(119)

      done()
    })
  })

  it("gets results", function(done) {
    client.getResult("5 + 5").then(function(result) {
      // expect(result).to.eql({})

      done()
    })
  })

  it("gets variables", function(done) {
    client.getVariables().then(function(result) {
      // expect(result).to.eql({})

      done()
    })
  })

})
