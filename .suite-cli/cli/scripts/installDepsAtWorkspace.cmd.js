
const { installDepsAtWorkspace, logSuccess, logError } = require('./scripts.module')

module.exports = async ({ packages, options }) => {
    try {
        const message = await installDepsAtWorkspace({
            workspace_name: options.workspaceName,
            workspace_directory: options.workspaceDirectory,
            packages: packages.join(' ')
        });
        logSuccess({ message })
    } catch (error) {
        logError({ error })
    }
}