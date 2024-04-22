
const { isMatch, logSuccess } = require('./scripts.module')
const { program } = require('commander');


program
    .description('Compares if 2 values match')
    .argument('<a>', 'first value')
    .argument('<b>', 'second value')
    .action((a, b) => {
        isMatch({ a, b }) ? logSuccess({ message: true }) : logError({ error: false })
        isMatch({ a, b });
    });
program.parse(process.argv);
module.exports = program