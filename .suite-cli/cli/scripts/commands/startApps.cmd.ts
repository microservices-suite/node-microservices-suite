
import { startApps } from '../scripts.module';
import { logger } from '../../utils/logger';

export default async ({ components, options }: { components: string[], options: { app: string, kubectl: string, mode: string }}) => {
    try {
        await startApps({ apps: components, mode: options.mode, kubectl: options.kubectl });
    } catch (errors) {
        logger.error(errors)
    }
};