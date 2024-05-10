#!/usr/bin/env node

const { Command } = require('commander');
const { createPromptModule } = require('inquirer');
const figlet = require('figlet');
const actionHandlers = require('./scripts')
const { logInfo } = require('./scripts/scripts.module');
const program = new Command()
const prompt = createPromptModule()
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
  .action(() => actionHandlers.getPlatform())
program
  .command('prune')
  .description('prunes docker artifacts. Does not prompt for confirmation. See docker [system,volume] prune --help')
  .option('-f, --force', 'Do not prompt for confirmation')
  .option('-v, --volume', 'runs docker volume prune')
  .option('-a, --all', 'runs docker system && docker volume prune')
  .action(async (options) => { await actionHandlers.dockerPrune({ options }) });
program
  .command('install')
  .description('Installs dependencies at given workspace. If not specified workspace defaults to "microservices"')
  .requiredOption('-n, --workspace-name <name>', 'Name of the workspace where to install dependencies')
  .option('-d, --workspace-directory <directory>', 'Name of the workspace where to install dependencies', 'microservices')
  .argument('<packages...>', 'Space-separated list of packages to install')
  .action(async (packages, options) => await actionHandlers.installDepsAtWorkspace({ packages, options }));
program
  .command('reset [components...]')
  .description('deep remove all node modules and artefacts generated during yarn install')
  .action(async (components, options) => await actionHandlers.repoReset({ options, components }));
program
  .command('release [package]')
  .description('make a package release and publish simultaneously to npm.If no package is passed then generate:release for changelog is run')
  .action(async (package) => await actionHandlers.releasePackage({ package }));
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
program
  .command('generate')
  .description('Generate a new monorepo resource')
  .action(() => {
    prompt([
      {
        type: 'list',
        name: 'resource',
        message: 'What would you like to generate?',
        choices: ['monorepo', 'service', 'library', 'app', 'gateway']
      }
    ])
      .then(answers => {
        switch (answers.resource) {
          case 'monorepo':
            // Additional prompts specific to 'monorepo' resource
            prompt([
              {
                type: 'input',
                name: 'repo_name',
                message: `Enter monorepo name:`,
                // TODO: validate workspace compliant name using regex
                validate: input => input ? true : 'Repo name cannot be empty.'
              },
              {
                type: 'checkbox',
                name: 'apis',
                message: 'Select APIs to use in your monorepo:',
                choices: ['REST', 'GraphQL', 'SOAP'],
                default: ['REST', 'GraphQL']

              },
              {
                type: 'list',
                name: 'webserver',
                message: 'Select webserver:',
                choices: ['nginx', 'apache'],
                default: 'nginx'
              },
              {
                type: 'list',
                name: 'license',
                message: 'Select license:',
                choices: ['ISC', 'MIT'],
                default: 'ISC'
              },{
                type: 'input',
                name: 'service_name',
                message: 'Initial service:',
                default: 'microservice1'
              }
              
            ])
              .then(answers => {
                //   find out if this separater works on windows
                // const project_base = `@${answers.repo_name}-${Date.now()}`
                const project_base = `@${answers.repo_name}`
                actionHandlers.scaffoldNewRepo({ answers: { ...answers, project_base, private: true } });
              });
            break;
          case 'service':
            prompt([
              {
                type: 'input',
                name: 'service_name',
                message: 'Enter service name:',
                // TODO: validate workspace compliant name using regex
                validate: input => input ? true : 'Name cannot be empty',
              }
            ]).then((answers) => actionHandlers.scaffoldNewService({ answers: { ...answers, private: true } }))
            break;
          case 'library':
            prompt([
              {
                type: 'input',
                name: 'library_name',
                message: 'Enter library name:',
                // TODO: validate workspace compliant name using regex
                validate: input => input ? true : 'Name cannot be empty',
              }
            ]).then((answers) => actionHandlers.scaffoldNewLibrary({ answers: { ...answers, private: false } }))
            break
          default:
            console.log('Handling other resources, not yet implemented.');
          // Handle other cases or provide feedback that other options are not yet implemented
        }
      });
  });


program.parse(process.argv);
module.exports = program