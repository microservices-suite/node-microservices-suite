
import { checkDocker, getPlatform } from '../scripts.module';
import { logger } from '../../utils/logger';

export default async () => {
    const isDockerRunning = await checkDocker();
    const platform = getPlatform();
    const platformEmoji = platform === 'MacOS' ? '🍏' : platform === 'Linux' ? '🐧' : '🪟';
    const dockerStatusMessage = isDockerRunning ? 'running...' : 'not running.';
    const dockerStatusIcon = isDockerRunning ? '✓' : '⚠️';
    logger.info(`Platform: ${platformEmoji} ${platform} : ${dockerStatusIcon} Docker is ${dockerStatusMessage}`);
};
