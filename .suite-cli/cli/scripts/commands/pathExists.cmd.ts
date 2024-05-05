
import { pathExists } from '../scripts.module';
import { logger } from '../../utils/logger';
import { statSync } from 'fs';

export default ({ file_path }: { file_path: string }) => {
    pathExists({ file_path }) ? logger.info(`${statSync(file_path).isFile() ? 'File' : 'Directory'} found:- ${file_path}`) : logger.error(`Path not found:- ${file_path}`)
}