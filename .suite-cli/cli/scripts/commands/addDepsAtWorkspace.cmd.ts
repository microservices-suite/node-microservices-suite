
import { addDepsAtWorkspace } from '../scripts.module';
import { logger } from '../../utils/logger';

export default async ({ packages, options }: { packages: string[], options: { workspaceName: string, workspaceDirectory: string } }) => {
  try {
    const message = await addDepsAtWorkspace({
      workspace_name: options.workspaceName,
      workspace_directory: options.workspaceDirectory,
      //@ts-ignore
      // TODO: Provide correct type definitions
      packages: package.join(' ') // This should be fine if addDepsAtWorkspace expects a space-separated string
    });
    logger.success(message);
  } catch (error) {
    if (error instanceof Error) {
      const CODE = error && error.message.split(':')[1];
      if (!['EEXIST', 'ENOENT', 'EINVAL', 'ENOTDIR'].includes(CODE)) logger.error(error);
    }
  }
}
