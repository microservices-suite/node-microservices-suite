#!/usr/bin/env node

const { program } = require('commander');
const { addDepsAtWorkspace, logSuccess, logError } = require('./scripts.module')
const figlet = require('figlet')

console.log(figlet.textSync('Microservices-Suite'))
program
  .command('add')
  .description('Adds dependencies at given workspace and updates package.json')
  .requiredOption('-n, --workspace-name <name>', 'Name of the workspace where to add dependencies')
  .option('-d, --workspace-directory <directory>', 'Directory where to look for the workspace. Defaults to "microservices"', 'microservices')
  .argument('<packages...>', 'Space-separated list of packages to add')
  .action(async(packages, options) => {
    try {
      const message = await addDepsAtWorkspace({
        workspace_name: options.workspaceName,
        workspace_directory: options.workspaceDirectory,
        packages: packages.join(' ')
      });
      logSuccess({ message })
    } catch (error) {
      logError({ error })
    }
  });
program.parse(process.argv);
module.exports = program