
const { checkDocker, getPlatform, logInfo } = require('./scripts.module')
const { program } = require('commander')


program
    .description('Checks if docker is running')
    .action(async () => {
        const _ = await checkDocker()
        logInfo({ message: `Platform : ${`${getPlatform() === 'MacOS' ? '🍏' : 'Linux' ? '🐧' : '🪟'} ${getPlatform()}`} :  ${_ ? '✓' : '⚠️'} docker is ${_ ? 'running...' : 'not running. Attempting to start docker...'}` })
    })
program.parse(process.argv);
module.exports = program