#!/usr/bin/env node

const ora = require('ora')
const { Command } = require('commander');
const { createPromptModule } = require('inquirer');
const { execSync } = require('node:child_process')
const { cwd } = require('node:process');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { cwd } = require('node:process');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const actionHandlers = require('./scripts')
const { logInfo, getExistingComponent, getExistingApps, getNextAvailablePort, scaffoldApp, scaffoldGateways, readFileContent } = require('./scripts/scripts.module');

const program = new Command();
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJSON = JSON.parse(readFileSync(packageJsonPath, { 'encoding': 'utf8' }));
program.version(packageJSON.version); //get library version set by release script
const prompt = createPromptModule();
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
  .option('-d, --workspace-directory <directory>', 'Name of the directory where to install dependencies', 'microservices')
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
  .command('test [package]')
  .description('run tests')
  .action(async (package) => await actionHandlers.test({ package }));
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
  .action(async () => {
    try {
      // Check if Yarn is installed
      execSync('yarn --version', { stdio: 'ignore' });
    } catch (error) {
      const spinner = ora().fail('Yarn is not installed.');

      const { installYarn } = await prompt([
        {
          type: 'confirm',
          name: 'installYarn',
          message: 'Would you like to install it now?',
          default: true
        }
      ]);

      if (installYarn) {
        try {
          spinner.start('Installing Yarn...');
          execSync('npm install -g yarn', { stdio: 'inherit' });
          spinner.succeed('Yarn installed successfully.');
        } catch (installError) {
          spinner.fail('Failed to install Yarn. Please install it manually and try again.');
          process.exit(1);
        }
      } else {
        spinner.fail('Yarn is required to proceed. Exiting.');
        process.exit(1);
      }
    }
    prompt([
      {
        type: 'list',
        name: 'resource',
        message: 'What would you like to generate?',
        choices: ['monorepo', 'service', 'library', 'app', 'gateway']
      }
    ])
      .then(answers => {
        let existing_services = []
        try {
          existing_services = getExistingComponent({ key: 'services', currentDir: cwd() })
        } catch (error) {

        }
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
              }, {
                type: 'input',
                name: 'service_name',
                message: 'Initial service:',
                default: 'microservice1'
              }, {
                type: 'input',
                name: 'port',
                message: 'Enter port (optional):',
                default: 9001,
                validate: input => input === '' || !isNaN(input) ? true : 'Port must be a number.'
              }

            ])
              .then(answers => {
                //   find out if this separater works on windows
                // const project_base = `@${answers.repo_name}-${Date.now()}`
                const project_base = `@${answers.repo_name}`
                actionHandlers.scaffoldNewRepo({
                  answers: {
                    ...answers,
                    project_base,
                    private: true,
                    default_broker: 'rabbitmq',
                    port: parseFloat(answers.port)
                  }
                });
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
              },
            ]).then((ans) => {
              const { service_name } = ans;
              const service_idx = existing_services.findIndex((s) => s.name === service_name);
              // if service exists return the port otherwise generate next available port
              const next_port = existing_services[service_idx]?.port || getNextAvailablePort({ key: existing_services, port: 'port' });
              prompt([
                {
                  type: 'input',
                  name: 'port',
                  message: 'Enter port (optional):',
                  default: next_port,
                  validate: input => input === '' || !isNaN(input) ? true : 'Port must be a number.'
                }
              ]).then((answers) => {
                actionHandlers.scaffoldNewService({
                  answers: {
                    ...answers,
                    service_name,
                    private: true,
                    port: parseFloat(answers.port)
                  }
                })
              });
            });
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
          case 'app':
            const existing_apps = getExistingComponent({ key: 'apps', currentDir: cwd() }) || []
            const formatServiceName = (service) => `${service.name}: ${service.port}`;
            prompt([
              {
                type: 'input',
                name: 'app_name',
                message: 'Enter the application name:',
              },
              {
                type: 'checkbox',
                name: 'services',
                message: 'Select services',
                choices: existing_services.map(service => ({
                  name: formatServiceName(service),
                  value: service,
                  checked: true, // Default all services to be selected
                })),
              }]).then((ans) => {
                const { app_name } = ans;
                const app_idx = existing_apps.findIndex((a) => a.name === app_name);
                // if app exists return the port otherwise generate next available port
                const next_port = existing_apps[app_idx]?.GATEWAY_PORT || getNextAvailablePort({ key: existing_apps, port: 'GATEWAY_PORT' });
                prompt([
                  {
                    type: 'input',
                    name: 'gateway_port',
                    message: 'Enter gateway port (optional):',
                    default: next_port,
                    validate: input => !isNaN(input) ? true : 'Port must be a number.'
                  },
                  {
                    type: 'input',
                    name: 'api_version',
                    message: 'Whats the api version? (optional):',
                    default: 'v1',
                  },
                  {
                    type: 'input',
                    name: 'gateway_cache_period',
                    message: 'How long do you want the gateway to cache data (optional):',
                    default: 3600,
                    validate: input => !isNaN(input) ? true : 'Caching period must be a number.'
                  },
                  {
                    type: 'input',
                    name: 'gateway_timeout',
                    message: 'How long should a request take before timing out (optional):',
                    default: 300,
                    validate: input => input === '' || !isNaN(input) ? true : 'Timeout must be a number.'
                  }
                ]).then((answers) => {
                  scaffoldApp({
                    answers: {
                      ...answers,
                      ...ans,
                      port: parseFloat(answers.gateway_port)

                    }
                  })
                });
              })
            break;
          case 'gateway':
            const apps = getExistingApps({ currentDir: cwd() });
            if (!apps) {
              logInfo({ message: `No apps found in this project. You need to have atleast one app to generate a gateway` })
              ora().info(`Run 'suite generate' to create one...`)
              process.exit(0);

            }
            const formatAppsName = (app) => app.name;
            prompt([
              {
                type: 'checkbox',
                name: 'apps',
                message: 'Select apps',
                choices: apps.map(app => ({
                  name: formatAppsName(app),
                  value: app,
                  checked: true, // Default all services to be selected
                })),
              },
              {
                type: 'input',
                name: 'gateway_port',
                message: 'Enter port (optional):',
                default: 8080,
                validate: input => !isNaN(input) ? true : 'Port must be a number.'
              },
              {
                type: 'input',
                name: 'api_version',
                message: 'Whats the api version? (optional):',
                default: 'v1',
              },
              {
                type: 'input',
                name: 'gateway_cache_period',
                message: 'How long do you want the gateway to cache data (optional):',
                default: 3600,
                validate: input => !isNaN(input) ? true : 'Caching period must be a number.'
              },
              {
                type: 'input',
                name: 'gateway_timeout',
                message: 'How long should a request take before timing out (optional):',
                default: 300,
                validate: input => input === '' || !isNaN(input) ? true : 'Timeout must be a number.'
              }
            ]).then(answers => {
              scaffoldGateways({ answers })
            })
            break;
          default:
            console.log('Handling other resources, not yet implemented.');
          // Handle other cases or provide feedback that other options are not yet implemented
        }
      });
  });
  program
  .command('remove <resource> [resource_name]')
  .description('Clean remove a monorepo resource or all resources of a specific type with the --all flag.')
  .option('-f, --force', 'Force removal without confirmation')
  .option('--all', 'Remove all resources of the specified type')  // Add --all flag
  .action(async (resource, resource_name, options) => {
    const spinner = ora();

    // Validate --all flag usage
    if (!resource_name && !options.all) {
      spinner.fail('You must provide either a resource name or the --all flag to remove all resources.');
      return;
    }

    try {
      // Confirm the deletion if --force is not provided
      if (!options.force) {
        const { confirmRemoval } = await prompt([
          {
            type: 'confirm',
            name: 'confirmRemoval',
            message: `Are you sure you want to remove ${options.all ? `all ${resource}s` : `${resource} "${resource_name}"`} ?`,
            default: false
          }
        ]);

        if (!confirmRemoval) {
          spinner.info('Operation cancelled.');
          return;
        }
      }

      // Call the resource removal handler
      await actionHandlers.removeResource({ answers: { resource, resource_name, options } });

    } catch (error) {
      spinner.fail(`Failed to remove ${resource} ${resource_name || 'resources'}: ${error.message}`);
    }
  });


program.parse(process.argv);
module.exports = program