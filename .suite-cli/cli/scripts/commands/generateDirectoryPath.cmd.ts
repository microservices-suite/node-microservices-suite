
import { generateDirectoryPath } from '../scripts.module';
import { logger } from '../../utils/logger';

export default ({ workspace_name, options }: { workspace_name: string, options: { workspaceDirectory: string }}) => {
  const path = generateDirectoryPath({
    workspace_name,
    workspace_directory: options.workspaceDirectory
  });
  logger.info(path)
}