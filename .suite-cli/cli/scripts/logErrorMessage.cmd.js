#!/usr/bin/env node

const { program } = require('commander');
const { logError } = require('./scripts.module')
const figlet = require('figlet');

console.log(figlet.textSync('Microservices-Suite'))
program
    .description('Prints Error message to screen')
    .argument('<error>', 'Error to display to console')
    .action((error) => {
        logError({ error });
    });
program.parse(process.argv);
module.exports = program