var path = require('path');

module.exports = {
  appPath: function() {
    switch (process.platform) {
      case 'darwin':
        return path.join(__dirname, '..', '.tmp', 'BozonApp-darwin-x64', 'BozonApp.app', 'Contents', 'MacOS', 'BozonApp');
      case 'linux':
        return path.join(__dirname, '..', '.tmp', 'BozonApp-linux-x64', 'BozonApp');
      default:
        throw 'Unsupported platform';
    }
  }
};
