
const { getPlatform, logInfo } = require('./scripts.module')
const { program } = require('commander');


program
    .description('Gets the platorm Os the app is running on')
    .action(() => {
        logInfo({ message: `Platform: ${getPlatform() === 'MacOS' ? '🍏' : 'Linux' ? '🐧' : '🪟'} ${getPlatform()}` });
    });
program.parse(process.argv);
module.exports = program