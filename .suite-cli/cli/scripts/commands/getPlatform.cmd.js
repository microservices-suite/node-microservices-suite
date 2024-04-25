
const { getPlatform, logInfo } = require('../scripts.module')


module.exports = () => {
    logInfo({ message: `Platform: ${getPlatform() === 'MacOS' ? '🍏' : 'Linux' ? '🐧' : '🪟'} ${getPlatform()}` });
}