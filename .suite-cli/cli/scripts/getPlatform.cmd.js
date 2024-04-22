#!/usr/bin/env node

const { program } = require('commander');
const { getPlatform, logInfo } = require('./scripts.module')
const figlet = require('figlet');
const chalk = require('chalk');

console.log(figlet.textSync('Microservices-Suite'))
program
    .description('Gets the platorm Os the app is running on')
    .action(() => {
        logInfo({ message: `Platform: ${getPlatform() === 'MacOS' ? '🍏' : 'Linux' ? '🐧' : '🪟'} ${getPlatform()}` });
    });
program.parse(process.argv);
module.exports = program