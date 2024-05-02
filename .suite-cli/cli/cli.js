#!/usr/bin/env node

const actionHandlers = require('./scripts')
const { Command } = require('commander');
const figlet = require('figlet');
const { logInfo } = require('./scripts/scripts.module');

const program = new Command()
actionHandlers.logInfoMessage({ message: (figlet.textSync('Microservices-suite')) })
program
    .command('add')
    .description('Adds dependencies at given workspace and updates package.json')
    .requiredOption('-n, --workspace-name <name>', 'Name of the workspace where to add dependencies')
    .option('-d, --workspace-directory <directory>', 'Directory where to look for the workspace. Defaults to "microservices"', 'microservices')
    .argument('<packages...>', 'Space-separated list of packages to add')
    .action(async (packages, options) => await actionHandlers.addDepsAtWorkspace({ packages, options }));
program
    .command('docker:check')
    .alias('do')
    .description('Checks if docker is running')
    .action(async () => await actionHandlers.checkDocker());
program
    .command('docker:start')
    .description('Starts the docker daemon')
    .action(async () => await actionHandlers.startDocker());
program
    .command('host')
    .description('Gets the host platorm Os the app is running on')
    .action(() => actionHandlers.getPlatform());
program
    .command('install')
    .description('Installs dependencies at given workspace. If not specified workspace defaults to "microservices"')
    .requiredOption('-n, --workspace-name <name>', 'Name of the workspace where to install dependencies')
    .option('-d, --workspace-directory <directory>', 'Name of the workspace where to install dependencies', 'microservices')
    .argument('<packages...>', 'Space-separated list of packages to install')
    .action(async (packages, options) => await actionHandlers.installDepsAtWorkspace({ packages, options }));

program
    .command('reset')
    .description('deep remove all node modules and artefacts generated during yarn install')
    .action(async ({ options, components }) => await actionHandlers.repoReset({ options, components }));
program
    .command('start [components...]')
    .description('Starts specified components (services or apps), or all services in dev mode if -m is not specified')
    .option('-a, --app', 'Indicates that the components specified are apps. Defaults to Docker Compose')
    .option('-k, --kubectl', 'Run the components using kubectl instead of Docker Compose. This flag is ignored if -a is not provided')
    .option('-b, --build', 'If running dockerized up docker compose rebuilds the images i.e docker compose up --build')
    .option('-v, --vanilla', 'Run the components directly without Docker. In development mode with Nodemon, otherwise with PM2')
    .option('-m, --mode <name>', 'Environment to run the component', 'dev')
    .action(async (components, options) => {
        if (options.app) {
            // running apps
            logInfo({ message: `Starting all apps in ${options.mode} mode...` })
            await actionHandlers.startApps({ components, options });
        }
        else {
            // running services
            await actionHandlers.startServices({ components, options });
        }

    });
program
    .command('stop [components...]')
    .description('stop running containers. Stops all containers if no app is specified')
    .action(async (components, options) => {
        logInfo({ message: `Stopping all apps in ${components}` })
        await actionHandlers.stopApps({ components, options });
    });

program.parse(process.argv);
module.exports = program