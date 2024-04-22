#!/usr/bin/env node

const { program } = require('commander');
const { logSuccess } = require('./scriptsmodule')
const figlet = require('figlet');
const chalk = require('chalk');

console.log(figlet.textSync('Microservices-Suite'))
program
    .description('Prints success message to screen')
    .argument('<message>', 'Message to display to console')
    .action((message) => {
        logSuccess({ message });
    });
program.parse(process.argv);
module.exports = program