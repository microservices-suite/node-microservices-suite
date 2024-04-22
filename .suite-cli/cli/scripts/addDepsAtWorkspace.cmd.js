
const { addDepsAtWorkspace, logSuccess, logError, logInfo } = require('./scripts.module')
const { program } = require('commander');


program
  .command('add')
  .description('Adds dependencies at given workspace and updates package.json')
  .requiredOption('-n, --workspace-name <name>', 'Name of the workspace where to add dependencies')
  .option('-d, --workspace-directory <directory>', 'Directory where to look for the workspace. Defaults to "microservices"', 'microservices')
  .argument('<packages...>', 'Space-separated list of packages to add')
  .action(async (packages, options) => {
    try {
      const message = await addDepsAtWorkspace({
        workspace_name: options.workspaceName,
        workspace_directory: options.workspaceDirectory,
        packages: packages.join(' ')
      });
      logSuccess({ message })
    } catch (error) {
      const CODE = error.split(':')[1]
      if(![' EEXIST',' ENOENT',' EINVAL',' ENOTDIR'].includes(CODE))logError({ error })
    }
  });
program.parse(process.argv);
module.exports = program