'use strict';

const electron = require('electron-prebuilt');
const spawn    = require('child_process').spawn;

let appPath     = './example-apps/demo/';
let processArgv = process.argv.slice(2);

let args = [
  appPath,
  '--debug=3030',
  '--dev',
  '--show-devtools'
].concat(processArgv);

let app = spawn(electron, args, {
  stdio: 'inherit'
});

app.on('close', () => {
  // User closed the app. Kill the host process.
  process.exit();
});
