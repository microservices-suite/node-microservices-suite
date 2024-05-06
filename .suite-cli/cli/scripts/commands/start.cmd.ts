
import { start } from '../scripts.module';

import { logger } from '../../utils/logger';

export default async ({  components, options }: { components: string[], options: { app: string, kubectl: string, vanilla: boolean  }}) => {
    try {
        await start({  components, options });
    } catch (errors) {
        logger.error(errors)
    }
};