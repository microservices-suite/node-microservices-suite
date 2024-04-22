
const { logInfo } = require('./scripts.module')
const { program } = require('commander');


program
    .description('Prints informational message to screen')
    .argument('<message>', 'Info to display to console')
    .action((message) => {
        logInfo({ message });
    });
program.parse(process.argv);
module.exports = program