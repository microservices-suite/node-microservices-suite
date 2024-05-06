
import { startDocker } from '../scripts.module';

import { logger } from '../../utils/logger';

export default async () => {
    try {
        const message = await startDocker();
        if (message.split(' ').includes('⏳')) logger.success(message)
        else logger.info(message)
    } catch (error) {
        logger.error(error)
    }
}