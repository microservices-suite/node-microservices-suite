
const { generateDirectoryPath, logInfo } = require('./scripts.module')

module.exports = ({ workspace_name, options }) => {
  const path = generateDirectoryPath({
    workspace_name,
    workspace_directory: options.workspaceDirectory
  });
  logInfo({ message: path })
}