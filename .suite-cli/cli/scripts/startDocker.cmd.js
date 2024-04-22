
const { startDocker, logError, logInfo, logSuccess } = require('./scripts.module')
const { program } = require('commander')



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