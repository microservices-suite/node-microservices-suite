#!/usr/bin/env node

const actionHandlers = require('./scripts')
const { Command } = require('commander');
const program = new Command()

program
    .command('err')
    .description('Prints Error message to screen')
    .argument('<error>', 'Error to display to console')
    .action((error) => {
        actionHandlers.logErrorMessage({ error });
    })

program.command('info')
    .description('Prints informational message to screen')
    .argument('<message>', 'Info to display to console')
    .action((message) => {
        actionHandlers.logInfoMessage({ message })
    })

program.command('succ')
    .description('Prints success message to screen')
    .argument('<message>', 'Message to display to console')
    .action((message) => {
        actionHandlers.logSuccessMessage({ message });
    });

program
    .command('docker:check')
    .alias('do')
    .description('Checks if docker is running')
    .action(async () => await actionHandlers.checkDocker());
program
    .command('chdir')
    .description('The function cds into given directory_path')
    .argument('<directory_path>', 'The path to the file')
    .action((directory_path) => actionHandlers.changeDirectory({ directory_path }));
program
    .command('host')
    .description('Gets the host platorm Os the app is running on')
    .action(() => actionHandlers.getPlatform);
program
    .command('add')
    .description('Adds dependencies at given workspace and updates package.json')
    .requiredOption('-n, --workspace-name <name>', 'Name of the workspace where to add dependencies')
    .option('-d, --workspace-directory <directory>', 'Directory where to look for the workspace. Defaults to "microservices"', 'microservices')
    .argument('<packages...>', 'Space-separated list of packages to add')
    .action(async (packages, options) => await actionHandlers.addDepsAtWorkspace({ packages, options }));
program
    .command('install')
    .description('Installs dependencies at given workspace. If not specified workspace defaults to "microservices"')
    .requiredOption('-n, --workspace-name <name>', 'Name of the workspace where to install dependencies')
    .option('-d, --workspace-directory <directory>', 'Name of the workspace where to install dependencies', 'microservices')
    .argument('<packages...>', 'Space-separated list of packages to install')
    .action(async (packages, options) => await actionHandlers.installDepsAtWorkspace({ packages, options }));
program
    .command('equal')
    .description('Compares if 2 values match')
    .argument('<a>', 'first value')
    .argument('<b>', 'second value')
    .action((a, b) => actionHandlers.isMatch({ a, b }));
program
    .command('path:exist')
    .description('Checks if the file exists at the given path')
    .argument('<file_path>', 'The path to the file to check')
    .action((file_path) => actionHandlers.pathExists({ file_path }));

program
    .command('docker:start')
    .description('Starts the docker daemon')
    .action(async () => await actionHandlers.startDocker());
program
    .command('path:gen')
    .description('Dynamically generate directory path given workspace_name')
    .argument('<workspace-name>', 'Name of the workspace to cd into')
    .option('-d, --workspace-directory <directory>', 'Directory where to look for the workspace. Defaults to "microservices"', 'microservices')
    .action((workspace_name, options) => actionHandlers.generateDirectoryPath({ workspace_name, options }));
program.parse(process.argv);
module.exports = program