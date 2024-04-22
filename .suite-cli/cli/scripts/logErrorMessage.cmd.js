
const { logError } = require('./scripts.module')
const { program } = require('commander');


program
    .description('Prints Error message to screen')
    .argument('<error>', 'Error to display to console')
    .action((error) => {
        logError({ error });
    });
program.parse(process.argv);
module.exports = program