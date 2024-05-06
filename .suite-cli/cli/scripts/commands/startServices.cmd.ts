
import { startServices } from '../scripts.module';
import { logger } from '../../utils/logger';

export default async ({ components, options }: { components: string[], options: { mode: string, vanilla: boolean }}) => {
    try {
        await startServices({ services: components, mode: options.mode, vanilla: options.vanilla });
    } catch (errors) {
        logger.error(errors)
    }
};