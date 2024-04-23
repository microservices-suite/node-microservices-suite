
const { startDocker, logError, logInfo, logSuccess } = require('./scripts.module')

module.exports = async () => {
    try {
        const message = await startDocker();
        if (message.split(' ').includes('⏳')) logSuccess({ message })
        else logInfo({ message })
    } catch (error) {
        logError({ error })
    }
}