
const { addDepsAtWorkspace, logSuccess, logError } = require('../scripts.module')

module.exports = async ({ packages, options }) => {
  try {
    const message = await addDepsAtWorkspace({
      workspace_name: options.workspaceName,
      workspace_directory: options.workspaceDirectory,
      packages: packages.join(' ')
    });
    logSuccess({ message })
  } catch (error) {
    const CODE = error.split(':')[1]
    if (![' EEXIST', ' ENOENT', ' EINVAL', ' ENOTDIR'].includes(CODE)) logError({ error })
  }
}