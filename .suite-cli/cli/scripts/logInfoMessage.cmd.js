#!/usr/bin/env node

const { program } = require('commander');
const { logInfo } = require('./scripts.module')
const figlet = require('figlet');
const chalk = require('chalk');

console.log(figlet.textSync('Microservices-Suite'))
program
    .description('Prints informational message to screen')
    .argument('<message>', 'Info to display to console')
    .action((message) => {
        logInfo({ message });
    });
program.parse(process.argv);
module.exports = program