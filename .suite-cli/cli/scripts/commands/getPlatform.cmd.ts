
import { getPlatform } from '../scripts.module';
import { logger } from "../../utils/logger"

export default () => {
    logger.info({ message: `Platform: ${getPlatform() === 'MacOS' ? '🍏' : 'Linux' ? '🐧' : '🪟'} ${getPlatform()}` });
}