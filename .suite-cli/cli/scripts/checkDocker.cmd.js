#!/usr/bin/env node

const { program } = require('commander')
const { checkDocker, getPlatform, logInfo } = require('./scripts.module')

require('./scripts.module')
const figlet = require('figlet')

console.log(figlet.textSync('Microservices-Suite'))
program
    .description('Checks if docker is running')
    .action(async () => {
        const _ = await checkDocker()
        logInfo({ message: `Platform : ${`${getPlatform() === 'MacOS' ? '🍏' : 'Linux' ? '🐧' : '🪟'} ${getPlatform()}`} :  ${_ ? '✓' : '⚠️'} docker is ${_ ? 'running...' : 'not running. Attempting to start docker...'}` })
    })
program.parse(process.argv);
module.exports = program