#!/usr/bin/env node
import { checkDocker, changeDirectory, getPlatform, addDepsAtWorkspace, installDepsAtWorkspace, isMatch, pathExists, startDocker, generateDirectoryPath, startApps, startServices } from "./scripts"
import { Command } from "commander";
import figlet from "figlet";
import { logger } from "./utils/logger"

const program = new Command()
logger.info(figlet.textSync('Microservices-suite'))

program
    .command('err')
    .description('Prints Error message to screen')
    .argument('<error>', 'Error to display to console')
    .action((error) => {
        logger.error(error);
    })

program.command('info')
    .description('Prints informational message to screen')
    .argument('<message>', 'Info to display to console')
    .action((message) => {
        logger.info(message)
    })

program.command('succ')
    .description('Prints success message to screen')
    .argument('<message>', 'Message to display to console')
    .action((message) => {
        logger.success(message);
    });

program
    .command('docker:check')
    .alias('do')
    .description('Checks if docker is running')
    .action(async () => await checkDocker());
program
    .command('chdir')
    .description('The function cds into given directory_path')
    .argument('<directory_path>', 'The path to the file')
    .action((directory_path) => changeDirectory({ directory_path }));
program
    .command('host')
    .description('Gets the host platorm Os the app is running on')
    .action(() => getPlatform());
program
    .command('add')
    .description('Adds dependencies at given workspace and updates package.json')
    .requiredOption('-n, --workspace-name <name>', 'Name of the workspace where to add dependencies')
    .option('-d, --workspace-directory <directory>', 'Directory where to look for the workspace. Defaults to "microservices"', 'microservices')
    .argument('<packages...>', 'Space-separated list of packages to add')
    .action(async (packages, options) => await addDepsAtWorkspace({ packages, options }));
program
    .command('install')
    .description('Installs dependencies at given workspace. If not specified workspace defaults to "microservices"')
    .requiredOption('-n, --workspace-name <name>', 'Name of the workspace where to install dependencies')
    .option('-d, --workspace-directory <directory>', 'Name of the workspace where to install dependencies', 'microservices')
    .argument('<packages...>', 'Space-separated list of packages to install')
    .action(async (packages, options) => await installDepsAtWorkspace({ packages, options }));
program
    .command('equal')
    .description('Compares if 2 values match')
    .argument('<a>', 'first value')
    .argument('<b>', 'second value')
    .action((a, b) => isMatch({ a, b }));
program
    .command('path:exist')
    .description('Checks if the file exists at the given path')
    .argument('<file_path>', 'The path to the file to check')
    .action((file_path) => pathExists({ file_path }));

program
    .command('docker:start')
    .description('Starts the docker daemon')
    .action(async () => await startDocker());
program
    .command('path:gen')
    .description('Dynamically generate directory path given workspace_name')
    .argument('<workspace-name>', 'Name of the workspace to cd into')
    .option('-d, --workspace-directory <directory>', 'Directory where to look for the workspace. Defaults to "microservices"', 'microservices')
    .action((workspace_name, options) => generateDirectoryPath({ workspace_name, options }));
program
    .command('start [components...]')
    .description('Starts specified components (services or apps), or all services in dev mode if -m is not specified')
    .option('-a, --app', 'Indicates that the components specified are apps. Defaults to Docker Compose')
    .option('-k, --kubectl', 'Run the components using kubectl instead of Docker Compose. This flag is ignored if -a is not provided')
    .option('-v, --vanilla', 'Run the components directly without Docker. In development mode with Nodemon, otherwise with PM2')
    .option('-m, --mode <name>', 'Environment to run the component', 'dev')
    .action(async (components, options) => {
        if (options.app) {
            // running apps
            logger.info(`Starting all apps in ${options.mode} mode...`)
            await startApps({ components, options });
        }
        else {
            // running services
            await startServices({ components, options });
        }

    });

program.parse(process.argv);

export default program