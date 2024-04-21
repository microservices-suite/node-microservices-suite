#!/usr/bin/env node

const { program } = require('commander');
const { envFileExists, logInfo, logError } = require('./scriptsmodule')
const { statSync } = require('fs')
const figlet = require('figlet')

console.log(figlet.textSync('Microservices-Suite'))
program
    .description('Checks if the file exists at the given path')
    .argument('<file_path>', 'The path to the file to check')
    .action((file_path) => {
        envFileExists({ file_path }) ? logInfo({ message: `${statSync(file_path).isFile() ? 'File' : 'Directory'} found:- ${file_path}` }) : logError({ error: `Path not found:- ${file_path}` })
    });
program.parse(process.argv);
module.exports = program