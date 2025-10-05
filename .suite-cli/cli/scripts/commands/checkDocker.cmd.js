
const { checkDocker, getPlatform, logInfo } = require('../scripts.module');

module.exports = async () => {
    const isDockerRunning = await checkDocker();
    const platform = getPlatform();
    const platformEmoji = platform === 'MacOS' ? '🍏' : platform === 'Linux' ? '🐧' : '🪟';
    const dockerStatusMessage = isDockerRunning ? 'running...' : 'not running.';
    const dockerStatusIcon = isDockerRunning ? '✓' : '⚠️';

    logInfo({
        message: `Platform: ${platformEmoji} ${platform} : ${dockerStatusIcon} Docker is ${dockerStatusMessage}`
    });
};
