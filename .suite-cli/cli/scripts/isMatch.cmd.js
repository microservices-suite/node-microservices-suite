#!/usr/bin/env node

const { program } = require('commander');
const { isMatch, logSuccess, l, logSuccessogError } = require('./scripts.module')
const figlet = require('figlet');
const chalk = require('chalk');

console.log(figlet.textSync('Microservices-Suite'))
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