#!/usr/bin/env node

const { program } = require('commander')
const { startDocker, logError, logInfo, logSuccess } = require('./scripts.module')

require('./scripts.module')
const figlet = require('figlet')

console.log(figlet.textSync('Microservices-Suite'))
program
    .description('Checks if docker is running')
    .action(async () => {
        try {
            const message = await startDocker();
            if (message.split(' ').includes('⏳')) logSuccess({ message })
            else logInfo({ message })
        } catch (error) {
            logError({ error })
        }
    });
program.parse(process.argv);
module.exports = program