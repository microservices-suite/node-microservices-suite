
import { isMatch } from '../scripts.module';

import { logger } from '../../utils/logger';

export default ({ a, b }: { a: string, b: string }) => {
    isMatch({ a, b }) ? logger.success(true) : logger.error(false)
    isMatch({ a, b });
}