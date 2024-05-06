// module.exports.installDepsAtWorkspace = require('./commands/installDepsAtWorkspace.cmd');
// module.exports.addDepsAtWorkspace = require('./commands/addDepsAtWorkspace.cmd');
// module.exports.generateDirectoryPath = require('./commands/generateDirectoryPath.cmd');
// module.exports.changeDirectory = require('./commands/changeDirectory.cmd');
// module.exports.pathExists = require('./commands/pathExists.cmd');
// module.exports.isMatch = require('./commands/isMatch.cmd');
// module.exports.getPlatform = require('./commands/getPlatform.cmd');
// module.exports.checkDocker = require('./commands/checkDocker.cmd');
// module.exports.startDocker = require('./commands/startDocker.cmd');
// module.exports.startAll = require('./commands/startAll.cmd');
// module.exports.start = require('./commands/start.cmd');
// module.exports.startApps = require('./commands/startApps.cmd');
// module.exports.startServices = require('./commands/startServices.cmd');

import checkDockerCmd from './commands/checkDocker.cmd';
import installDepsAtWorkspace from './commands/installDepsAtWorkspace.cmd';
import addDepsAtWorkspace from "./commands/addDepsAtWorkspace.cmd"
import generateDirectoryPath from './commands/generateDirectoryPath.cmd';
import changeDirectory from './commands/changeDirectory.cmd';
import pathExists from './commands/pathExists.cmd';
import isMatch from './commands/isMatch.cmd';
import getPlatform from './commands/getPlatform.cmd';
import checkDocker from './commands/checkDocker.cmd';
import startDocker from './commands/startDocker.cmd';
import startAll from './commands/startAll.cmd';
import start from './commands/start.cmd';
import startApps from './commands/startApps.cmd';
import startServices from './commands/startServices.cmd';

export { 
    checkDockerCmd,
    installDepsAtWorkspace,
    generateDirectoryPath,
    changeDirectory,
    addDepsAtWorkspace,
    pathExists,
    isMatch,
    getPlatform,
    checkDocker,
    startDocker,
    startAll,
    start,
    startApps,
    startServices
}

