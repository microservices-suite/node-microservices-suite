
import { exit } from 'node:process';
import { changeDirectory } from '../scripts.module';
import { logger } from '../../utils/logger';
function hasCodeProperty(obj: any): obj is { code: string } {
    return typeof obj === 'object' && 'code' in obj;
}

export default ({ directory_path }: { directory_path: string }) => {
    try {
        changeDirectory({ directory_path });
        logger.success({ message: `Directory found:- ${directory_path}` })
    } catch (error: unknown) {
        if (hasCodeProperty(error)) {
            const errorCode = error.code;
            switch (errorCode) {
                case ('ENOENT'):
                    logger.error(`Direcotry not found:- ${directory_path}`);
                    exit(1)
                case ('ENOTDIR'):
                    logger.error(`Path not directory:- ${directory_path}`);
                    exit(1)
                default:
                    console.log(error)
            }
        }
    }
}