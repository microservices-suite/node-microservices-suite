
import { startAll } from './scripts.module';
import { logger } from "../utils/logger"

export default async ({ options }: { options: { app: string, kubectl: string, mode: string } }) => {
    try {
        await startAll({ options });
    } catch (errors) {
        logger.error(errors)
    }
};