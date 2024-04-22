
const { exit } = require('node:process')
const { changeDirectory, logError, logSuccess } = require('./scripts.module')
const { program } = require('commander');


program
    .description('The function cds into given directory_path')
    .argument('<directory_path>', 'The path to the file')
    .action((directory_path) => {
        try {
            changeDirectory({ directory_path });
            logSuccess({ message: `Directory found:- ${directory_path}` })
        } catch (error) {
            switch (error.code) {
                case ('ENOENT'):
                    logError({ error: `Direcotry not found:- ${directory_path}` });
                    exit(1)
                case ('ENOTDIR'):
                    logError({ error: `Path not directory:- ${directory_path}` });
                    exit(1)
                default:
                    console.log(error)

            }
        }
    });
program.parse(process.argv);
module.exports = program