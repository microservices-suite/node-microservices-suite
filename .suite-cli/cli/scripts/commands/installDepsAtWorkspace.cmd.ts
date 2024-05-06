
import { installDepsAtWorkspace } from '../scripts.module';
import { logger } from '../../utils/logger';

export default async ({ packages, options }: { packages: string[], options: { workspaceName: string, workspaceDirectory: string } }) => {
    try {
        const message = await installDepsAtWorkspace({
            workspace_name: options.workspaceName,
            workspace_directory: options.workspaceDirectory,
            //@ts-ignore
            // TODO: Provide correct type definition
            packages: packages.join(' ')
        });
        logger.success(message)
    } catch (error) {
        logger.error(error)
    }
}