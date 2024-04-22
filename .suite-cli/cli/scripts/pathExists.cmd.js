
const { pathExists, logInfo, logError } = require('./scripts.module')
const { program } = require('commander');
const { statSync } = require('fs')


program
    .description('Checks if the file exists at the given path')
    .argument('<file_path>', 'The path to the file to check')
    .action((file_path) => {
        pathExists({ file_path }) ? logInfo({ message: `${statSync(file_path).isFile() ? 'File' : 'Directory'} found:- ${file_path}` }) : logError({ error: `Path not found:- ${file_path}` })
    });
program.parse(process.argv);
module.exports = program