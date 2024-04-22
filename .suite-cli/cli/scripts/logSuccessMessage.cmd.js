
const { logSuccess } = require('./scripts.module')
const { program } = require('commander');


program
    .description('Prints success message to screen')
    .argument('<message>', 'Message to display to console')
    .action((message) => {
        logSuccess({ message });
    });
program.parse(process.argv);
module.exports = program