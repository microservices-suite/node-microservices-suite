const chalk = require('chalk')
const { join, sep, resolve } = require('node:path')
const fs = require('fs');
const path = require('node:path');
const os = require('os')
const { mkdirSync, readFile } = require('fs')
const { cwd, chdir, exit, platform } = require('node:process')
const { existsSync, statSync, readdirSync, writeFileSync, readFileSync, rmSync, rm } = require('node:fs');
let { exec, spawn } = require('node:child_process');
const { writeFile } = require('node:fs/promises');
const assets = require('./assets')
const ora = require('ora')
const glob = require('glob');
const https = require('https');

/**
 * Dynamically generate directory path given workspace_name
 * @param {Object} options  Options object containing workspace_name and workspace_directory
 * @param {string} options.workspace_name  Name of the workspace to cd into
 * @param {string} [options.workspace_directory]  Directory where to look for the workspace. Defaults to 'microservices'
 * @default  workspace_directory='microservice'
 * @returns {string} A full path to the workspace
 */
const generateDirectoryPath = ({ workspace_name, workspace_directory = 'microservice' }) => {
    return join(cwd(), `${workspace_directory}/${workspace_name}`);
}
/**
 * The function cds into given directory_path
 * @param {Object} options The path to the file
 * @param {string} options.directory_path The path to the file
 * @param {Object} options The path to the file
 * @param {string} options.directory_path The path to the file
 * @returns void
 */
const changeDirectory = ({ directory_path }) => {
    chdir(directory_path)
}


/**
 * Checks if the file exists at the given path.
 * @param {Object} options 
 * @param {string} options.file_path  The path to the file to check.
 * @returns {boolean} True if the file exists, false otherwise.
 */
const pathExists = ({ file_path }) => {
    return existsSync(file_path)
}
/**
 * Prints title to screen
 * @param {Object} options 
 * @param {string} options.message title to print
 * @returns {string}
 */
const logTitle = ({ message }) => console.log(chalk.grey(`${message}`))

/**
 * Prints success message to screen
 * @param {Object} options 
 * @param {string} options.message Message to display to console 
 * @returns {string}
 */
const logSuccess = ({ message }) => console.log(chalk.greenBright(`✓  ${message}`))

/**
 * Prints error message to screen
 * @param {Object} options
 * @param {string} options.error Error message to display to console 
 * @returns {string}
 */
const logError = ({ error }) => console.log(chalk.red(`⚠️  ${error}`))

/**
 * Prints success message to screen
 * @param {Object} options Message to display to console 
 * @param {string} options.message Message to display to console 
 * @returns {string}
 */
const logInfo = ({ message }) => console.log(chalk.gray(`✓  ${message}`))


/**
 * Prints Warning message to screen
 * @param {Object} options 
 * @param {string} options.message Warning to display to console 
 * @returns {string}
 */
const logWarning = ({ message }) => console.log(chalk.yellow(`✓  ${message}`))

/**
 * Prints advise message to screen
 * @param {Object} options 
 * @param {string} options.message advise to display to console 
 * @returns {string}
 */
const logAdvise = ({ message }) => console.log(chalk.stderr(`✓  ${message}`))

/**
 * Compares if 2 values match
 * @param {Object} options
 * @param {string} options.a first value 
 * @param {string} options.b second value 
 * @returns {boolean} Returns true if a === b otherwise false
 */
const isMatch = ({ a, b }) => a === b

/**
 * Gets the platorm Os the app is running on
 * @returns {string} The Os the app is running on
 */
const getPlatform = () => {
    const PLATFORM = {
        'aix': 'IBM AIX',
        'darwin': 'MacOS',
        'freebsd': 'FreeBSD',
        'linux': 'Linux',
        'openbsd': 'OpenBSD',
        'sunos': "SunOS",
        'win32': 'Windows'
    }
    return PLATFORM[platform]
}

/**
 * Checks if docker is running
 * @returns {Promise<boolean>} Returns true if docker is running otherwise false
 */
const checkDocker = () => {
    return new Promise((resolve, reject) => {
        let command;
        switch (platform) {
            case 'win32':
                command = 'docker info > NUL 2>&1';
                break;
            default:
                command = 'docker info > /dev/null 2>&1';
                break;
        }

        // Execute the command
        exec(command, (error, stdout, stderr) => {
            if (error) {
                resolve(false); // Docker is not running or not installed
            } else {
                resolve(true); // Docker is running
            }
        });
    });
}

/**
 * Starts the docker daemon
 * @returns {Promise<string>} Starts docker in the background if successfull and a success message otherwise returns a failure message with more instructions if possible
 */
const startDocker = () => {
    return new Promise(async (resolve, reject) => {
        let command;
        switch (platform) {
            case 'darwin':
                command = 'open /Applications/Docker.app';
                break;
            case 'linux':
                command = 'systemctl start docker';
                break;
            case 'win32':
                command = 'start "" "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"';
                break;
            default:
                return reject('Unsupported platform');
        }

        if (await checkDocker()) {
            resolve('Docker is already running ...')
        }
        // TODO: switch to spawnSync
        exec(command, async (error, stdout, stderr) => {
            if (error) {
                reject(`⇣ Install Docker to run this command: ${chalk.blue('https://docs.docker.com/engine/install/')}`);
            }
            else {
                resolve('⏳ Docker daemon is starting... Please check Docker status to ensure it is running.');
            }
        });
    });
};

/**
 * Installs dependencies at given workspace
 * @param {Object} options Options object containing workspace_name and workspace_directory
 * @param {string} options.workspace_name  Name of the workspace where to install dependencies
 * @param {string} [options.workspace_directory='microservices'] Workspace parent directory
 * @default options.workspace_directory='microservices' 
 * @returns {void} Does not return a value. Installs dependencies at given workspace
 */
const installDepsAtWorkspace = ({ workspace_name, workspace_directory = 'microservices', packages }) => {
    return new Promise((resolve, reject) => {
        try {
            const directory_path = generateDirectoryPath({ workspace_name, workspace_directory });

            // Platform aware cd
            const command = process.platform === 'win32' ?
                `cd /d "${directory_path}" && yarn --silent install` :
                `cd "${directory_path}" && yarn --silent install`;

            const options = {
                shell: platform === 'win32' ? 'C:\\Program Files\\Git\\bin\\bash.exe' : '/bin/bash'
            };

            exec(command, options, (err, stdout, stderr) => {
                if (err) {
                    const split_stack = err.stack.split('\n')[1].split(sep)
                    if (split_stack[split_stack.length - 1].split([':']).includes('undefined')) { reject('Workspace name not provided!') }
                    else {
                        reject(err.stack.split('\n')[1]); // Extracting the first line of the stack trace
                    }
                } else {
                    // TODO: to fix hardcoded organization @microser...
                    resolve(`Successfully installed packages: @microservices-suite/${workspace_name}`);
                }
            });
        } catch (error) {
            return reject(`Directory does not exist: ${directory_path}`);
        }
    });


};
/**
 * Adds dependencies at given workspace and update package.json
 * @param {Object} options Options object containing workspace_name and workspace_directory
 * @param {string} options.workspace_name  Name of the workspace where to add dependencies
 * @param {string} [options.workspace_directory='microservices'] Directory where to look for the workspace. Defaults to 'microservices'
 * @param {string} packages Space-separated list of packages to add
 * @default options.workspace_directory='microservices' 
 * @returns {string}  Returns success message
 * @throws  Error if package not found in registry
 */
const addDepsAtWorkspace = ({ workspace_name, workspace_directory = 'microservices', packages }) => {
    return new Promise((resolve, reject) => {
        try {
            const directory_path = generateDirectoryPath({ workspace_name, workspace_directory });

            // Platform aware cd
            const command = process.platform === 'win32' ?
                `cd /d "${directory_path}" && yarn --silent add ${packages}` :
                `cd "${directory_path}" && yarn --silent add ${packages}`;

            const options = {
                shell: platform === 'win32' ? 'C:\\Program Files\\Git\\bin\\bash.exe' : '/bin/bash'
            };

            exec(command, options, (err, stdout, stderr) => {
                if (err) {
                    const split_stack = err.stack.split('\n')[1].split(sep)
                    if (split_stack[split_stack.length - 1].split([':']).includes('undefined')) { reject('Workspace name not provided!') }
                    const errorMessage = stderr || err.message;
                    const packageNameRegex = /\/([^/:]+):/;
                    const match = packageNameRegex.exec(errorMessage);
                    if (match && match[1]) {
                        reject(`Package not found in registry: ${match[1]}`);

                    } else {
                        reject(err.stack.split('\n')[1]); // Extracting the first line of the stack trace
                    }
                } else {
                    resolve(`Successfully installed packages: ${packages} @microservices-suite/${workspace_name}`);
                }
            });
        } catch (error) {
            return reject(`Directory does not exist: ${directory_path}`);
        }
    });
};


/**
* Starts components based on the provided options.
* @param {Object} options - Options object containing workspace_name and workspace_directory.
* @param {string[]} options.components - Names of the components to start.
* @param {string} [options.options] - Directory where to look for the workspace. Defaults to 'microservices'.
* @param {boolean} [options.app] - Indicates if the components are apps. Defaults to false.
* @param {boolean} [options.kubectl] - If true, uses kubectl to start apps. Defaults to false.
* @param {boolean} [options.vanilla] - If true, uses Nodemon to start services. Defaults to false.
* @returns {string} - Success message indicating the start of components.
*/
const start = async ({ components, options }) => {
    const type = options.app ? 'app' : 'service';
    logInfo({ message: `Starting ${components.length || 'all'} ${type}${components.length === 1 ? '' : 's'}...` });
    const useDockerCompose = options.app && !options.kubectl;

    for (const component of components) {
        const [name] = component.split(':');
        logInfo({ message: `Starting ${type}: ${name}...` });
        if (options.vanilla) {
            logError({ error: `-v flag is only used to run services. Apps only run with kubectl or docker compose` });
            // Logic to start the component with Nodemon
        } else if (useDockerCompose) {
            logInfo({ message: `Running ${type} ${name} with Docker Compose` });
            // Logic to start the component with Docker Compose
        } else {
            logInfo({ message: `Running ${type} ${name} with kubectl` });
            logInfo({ message: `Running ${type} ${name} with kubectl` });
            logInfo({ message: `Running ${type} ${name} with kubectl` });
            // Logic to start the component with kubectl
        }
    }
}

/**
 * Starts all components in the existing workspaces based on the provided options.
 * @param {Object} options - Environment settings for running the components.
 * @param {boolean} [options.kubectl] - If true, runs the app with kubectl.
 * @param {boolean} [options.mode] - Service environment mode. Defaults to 'dev' mode.
 * @param {boolean} [options.app] - If true, assumes the components defined are apps.
 * @returns {void} - Starts all components and logs their startup status.
 */
const startAll = async ({ options }) => {
    // case -k (--kubectl)
    if (options?.kubectl) {
        // -k(--kubectl) flag passed without specifying the app flag (-a,--app). Throw error & exit process
        if (!options.app) {
            logError({ error: 'kubectl is only used with -a flag to run apps. run suite help start for more info' })
            exit(1)
        }
        //TODO: spin app with kubectl pods
        spinKubectlPods({ app: options.app, mode: options.mode })
        // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]
    }
    // case -v(--vanilla)
    // TODO: run services with nodemon in dev mode otherwise PM2
    // runVanillaServices({ services: [], mode: options.mode })
    const currentDir = cwd();

    // Check if 'microservices' directory exists
    const is_component_dir = currentDir.split('/').includes('microservices');

    // Construct microservices directory path
    const microservicesDir = is_component_dir ?
        currentDir.split('/').slice(0, currentDir.split('/').indexOf('microservices') + 1).join('/') :
        `${currentDir}/microservices`;
    logInfo({
        message: `cwd: ${is_component_dir ?
            currentDir.split(sep).slice(0, currentDir.split(sep).indexOf('microservices') + 1).join(sep) :
            `${currentDir}${sep}microservices`}`
    });

    // Check if the microservices directory exists
    // TODO: Find a smart way to detect non-suite compliant repos
    if (!existsSync(microservicesDir) || !statSync(microservicesDir).isDirectory()) {
        reject(`This does not seem to be a suite monorepo project`);
        return;
    }

    // Get a list of directories in the microservices directory
    const serviceDirectories = readdirSync(microservicesDir)
        .filter(item => statSync(join(microservicesDir, item)).isDirectory());

    // Start each service
    if (options.app) {
        await spinApps({ components: [], options })
    } else {
        await spinServices({ microservicesDir, serviceDirectories, mode: options.mode })
    }
    // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]
    // case -v(--vanilla)
    // TODO: run services with nodemon in dev mode otherwise PM2
    // runVanillaServices({ services: [], mode: options.mode })
}

/**
 * Starts services with nodemon in development mode by default, otherwise with PM2.
 * @param {Object} options - Environment settings for running the services.
 * @param {string[]} options.serviceDirectories - List of service directories under `options.microservicesDir`.
 * @param {string} options.microservicesDir - The root directory of the services.
 * @param {string} [options.mode='dev'] - The environment mode for running the services. Defaults to 'dev'.
 * @returns {void} Starts the services and logs their startup status.
 */
const spinVanillaServices = async ({ serviceDirectories, microservicesDir, mode = 'dev' }) => {
    const spinner = ora('Starting all services in ' + mode + ' mode...').start();

    try {
        await Promise.all(serviceDirectories.map(async (dir) => {
            const servicePath = join(microservicesDir, dir);
            // TODO: check if the yarn.cmd works in windows really
            const command = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
            const args = [mode];

            const child = spawn(command, args, { cwd: servicePath, shell: true });

            child.stdout.on('data', (data) => {
                let output = data.toString();
                // Check if the output contains the "yarn run" message
                if (!output.includes('yarn run') && !output.includes('NODE_ENV')) {
                    // Stop the spinner before printing the output
                    if (output.includes('info')) {
                        const parts = output.trim().split(':');
                        const formattedOutput = formatLog(parts[0], dir, parts.slice(1).join(':').trim());
                        console.log(formattedOutput);
                    } else {
                        console.log(output.trim());
                    }
                    // Restart the spinner after printing the output
                }
            });

            child.stderr.on('data', (data) => {
                let output = data.toString();
                const parts = output.trim().split(':');
                const formattedOutput = formatLog(parts[0], dir, parts.slice(1).join(':').trim());
                // Handle stderr output
                console.log(formattedOutput);
            });

            child.on('close', (code) => {
                if (code !== 0) {
                    spinner.fail(`Service in directory ${dir} exited with code ${code}`);
                } else {
                    spinner.succeed(`Service in directory ${dir} started successfully`);

                }
            });
        }));

        spinner.succeed(`Service${serviceDirectories.length > 1 ? 's' : ''} started successfully: ${serviceDirectories.join(', ')}`);
        console.log('\n')
    } catch (error) {
        spinner.fail('An error occurred while starting services');
        console.error(error);
        process.exit(1);
    }
};

const padString = (str, length) => str.padEnd(length, ' ');

// Function to format the log messages
const formatLog = (level, dir, message) => {
    const paddedLevel = padString(level, 5);
    const paddedDir = padString(dir, 8);
    return `${paddedLevel}: ${paddedDir}: ${message}`;
};

/**
 * 
 * @param {Object} options Environment to run the 
 * @param {string} options.apps_dir The the apps root directory
 * @param {string} options.apps_directories List of app directories  under [options.apps_dir] 
 * @param {string} [options.mode] App environment. Defaults to dev mode
 * @param {string} [options.args] App environment. Defaults to dev mode
 * @returns {void} Starts apps with nodemon in devmode otherwise PM2
 */
const runDockerizedApps = async ({ apps_dir, apps_directories, mode = 'dev', build }) => {
    await Promise.all(
        apps_directories.map(async (dir) => {
            const dockerIsRunning = await checkDocker()
            if (!dockerIsRunning) {

                await startDocker()
            }
            setTimeout(() => {

            }, 1)
            const composeFile = mode === 'prod' ? 'docker-compose.yml' : `docker-compose.${mode}.yml`;

            const args = [
                'compose',
                '-f',
                `${apps_dir}/${dir}/${composeFile}`,
                'up',
                ...(build ? ['--build'] : [])
            ];
            const options = {
                cwd: join(apps_dir, dir),
                stdio: 'inherit', // Redirects stdout/stderr to parent process
                shell: true, // Run command in a shell
            };

            const composeProcessControlled = spawn('docker', args, options);

            composeProcessControlled.on('error', (error) => {
                console.error(`Failed to start Docker process in ${dir}`);
                console.error(error.message);
            });

            composeProcessControlled.on('exit', (code, signal) => {
                if (code !== 0) {
                    console.warn(`Docker process in ${dir} exited with code: ${code}, signal: ${signal}`);
                } else {
                    console.log(`Docker process in ${dir} exited successfully`);
                }
            });

            // TODO: handle docker errors
        }))
}

/**
 * Spins Kubernetes pods for the specified apps.
 * @param {Object} options - Environment settings for running the apps.
 * @param {string} options.apps_dir - The root directory where the apps are located.
 * @param {string[]} options.apps_directories - An array of directories containing the apps to run.
 * @param {string} options.mode - The environment mode for running the apps.
 * @returns {Promise<string>} A promise that resolves with a message indicating the success or failure of starting the service.
 */

const spinKubectlPods = ({ apps_dir, apps_directories, mode }) => {
    exec(`yarn workspace @microservices-suite/${dir} ${mode}`, { cwd: join(microservicesDir, dir) }, async (error, stdout, stderr) => {
        var error_message = ''
        if (error) {
            const _ = error.message.split('\n')
            if (_[1] && _[1].startsWith('error Command') && _[1].endsWith('not found.')) {
                error_message = `Missing script at ${dir}${sep}package.json: ${_[1].match(/"(.*?)"/)[1]}`
            }
            if (_[1] && _[1].includes('Unknown workspace')) {
                if (existsSync(`${microservicesDir}/${dir}/package.json`)) {
                    logWarning({ message: 'Wrong workspace naming' })
                    logAdvise({ message: 'Run suite fix -n to auto-fix all workspace naming issues' })
                    logAdvise({ message: 'suite fix only changes the package.json. If any service depends on it you will need to update it manually' })
                } else {

                    logError({ error: (`Missing package.json @microservices-suite${sep}${dir}`) })
                }
                exit(1)
            }
            logError({ error: error_message })
        } else {
            resolve(`Service in directory ${dir} started successfully`);
        }
    });
}

/**
 * Starts all components in the existing workspaces.
 * @param {Object} options - Environment settings for running the apps.
 * @param {string[]} [options.apps] - An array of app names to start.
 * @param {Object} options.options - Additional options for starting apps.
 * @param {boolean} [options.options.kubectl] - If true, runs the apps with kubectl.
 * @param {boolean} [options.options.mode] - The app environment mode.
 * @param {boolean} [options.options.build] - If true, builds the Docker images before running the apps.
 * @returns {void}
 */
const startApps = async ({ apps, options }) => {
    const {
        component_root_dir: apps_dir,
        components_directories: apps_directories
    } = await getComponentDirecotories({
        components: apps,
        component_type: 'app'
    })
    // case -k (--kubectl)
    logInfo({ message: `Starting all apps in ${options.mode} mode...` })
    if (options.kubectl) {
        //TODO: spin app with kubectl pods
        spinKubectlPods({ apps_dir, apps_directories, mode: options.mode })
    }
    else {
        runDockerizedApps({ apps_dir, apps_directories, mode: options.mode, build: options.build })
    }

    // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]

}

/**
 * Retrieves the root directory and directories of the specified component type.
 * @param {Object} options - Options for retrieving component directories.
 * @param {string[]} options.components - An array of component names.
 * @param {string} options.component_type - The type of component ('app' or 'microservice').
 * @returns {{component_root_dir: string, components_directories: string[]}} An object containing the root directory of the components and an array of directories for each component.
 */
const getComponentDirecotories = async ({ components, component_type }) => {
    const spinner = ora('Searching for component directories').start();
    let project_root;
    try {
        project_root = generateRootPath({ currentDir: cwd() })
    } catch (error) {
        if (error.message && error.message === 'suite.json and(or) .git not found') {
            spinner.warn('This does not look like a git repo.')
            spinner.info('Try git init and(or suite init)')
            exit(1)
        }
    }
    const package_json_path = join(project_root, 'package.json')

    const { workspace_name } = retrieveWorkSpaceName({ package_json_path })

    const component_root_dir = join(project_root, `${component_type === 'app' ? `docker/apps` : 'microservices'}`)

    // Simulate delay before checking if the component directory exists
    await delay(1);
    spinner.text = `Checking if ${component_root_dir} exists...`;

    // Simulate delay before checking if the component directory exists
    await delay(2);

    // Check if the component directory exists
    if (!existsSync(component_root_dir) || !statSync(component_root_dir).isDirectory()) {
        // Simulate delay before displaying failure message
        await delay(1);
        spinner.warn('This does not seem to be a suite monorepo project');
        spinner.info('If it is kindly open an issue here: https://github.com/microservices-suite/node-microservices-suite/issues');
        exit(1);
    }

    // Get a list of directories in the component directory
    let components_directories;
    if (!components.length) {
        spinner.text = 'Getting list of directories...';
        await delay(1);
        components_directories = readdirSync(component_root_dir)
            .filter(item => statSync(join(component_root_dir, item)).isDirectory());
    } else {
        spinner.text = 'Filtering directories...';
        await delay(2);
        components_directories = readdirSync(component_root_dir)
            .filter(item => components.includes(item) && statSync(join(component_root_dir, item)).isDirectory());

        components.forEach(service => {
            const valid_dir = components_directories.includes(service) && statSync(join(component_root_dir, service)).isDirectory();
            if (!valid_dir) {
                spinner.fail(`No such service under microservices workspace: ${service}`);
                exit(1);
            }
        });
    }
    spinner.succeed('Component directories found successfully');
    console.log('------------------------------------------');
    spinner.info(`Workspace: ${workspace_name}${sep}${components.join(' ')}`);
    spinner.info(`Path: ${component_root_dir}`);
    console.log('------------------------------------------');

    return { component_root_dir, components_directories };
};

// Function to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Starts all components in the existing workspaces.
 * @param {Object} options - Environment configuration.
 * @param {boolean} [options.vanilla] - If true, runs the services with nodemon.
 * @param {boolean} [options.mode] - App environment.
 * @param {string[]} [options.services] - An array of service names to start.
 * @returns {void}
 */

const startServices = async ({ services, mode, vanilla }) => {
    const {
        component_root_dir: microservices_root_dir,
        components_directories: microservices_directories
    } = await getComponentDirecotories({
        components: services,
        component_type: 'microsevice'
    })
    if (vanilla) {
        // TODO: run services with nodemon in dev mode otherwise PM2
        await spinVanillaServices({
            microservicesDir: microservices_root_dir,
            serviceDirectories: microservices_directories,
            mode
        })
    }

    // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]
}

/**
 * Resets the project to its initial state.
 * @param {Object} options - Options for resetting the project.
 * @param {string[]} options.components - An array of component names to reset.
 * @param {Object} options - Additional options.
 * @returns {void}
 */
const repoReset = ({ components, options }) => {
    let targetDir;

    if (components.length > 0) {
        // TODO: fix this not working yet
        const { component_root_dir } = getComponentDirecotories({ components, component_type: 'microservices' });
        targetDir = component_root_dir;
    } else {
        targetDir = cwd();
    }

    resetRepo({ targetDir });
};


const resetRepo = ({ targetDir }) => {
    try {
        let commands;

        if (process.platform === 'win32') {
            // Windows commands
            commands = [
                `for /d /r "${targetDir}" %i in (node_modules) do rd /s /q "%i"`,
                `for /r "${targetDir}" %i in (package-lock.json) do del "%i"`,
                `for /r "${targetDir}" %i in (yarn.lock) do del "%i"`,
                `for /d /r "${targetDir}" %i in (yarn-*) do rd /s /q "%i"`
            ];
        } else {
            // Unix-like commands
            commands = [
                `find ${targetDir} -maxdepth 3 -type d -name 'node_modules' -exec rm -rf {} +`,
                `find ${targetDir} -maxdepth 3 -type f -name 'package-lock.json' -delete`,
                `find ${targetDir} -maxdepth 3 -type f -name 'yarn.lock' -delete`,
                `find ${targetDir} -maxdepth 3 -type d -name 'yarn-*' -exec rm -rf {} +`
            ];
        }

        // Create spinner
        const spinner = ora('Resetting repository').start();

        // Execute each command
        commands.forEach(command => {
            const child = spawn(command, { shell: true });

            // Handle command exit
            child.on('close', (code, signal) => {
                if (code !== 0) {
                    //TODO: Define standard inhouse error codes
                    spinner.info(`Command exited with code E0000${code}`);
                    // report any codes other than 2
                    code !== 2 && spinner.warn('Kindly raise an issue at https://github.com/microservices-suite/node-microservices-suite/issues')
                }
            });
        });

        // Stop spinner
        spinner.succeed('Repository reset successfully');
    } catch (error) {
        console.error('Error occurred while resetting repository:', error);
        process.exit(1);
    }
};

/**
 * Stops Docker-compose-based applications.
 * @param {Object} options - Options for stopping apps.
 * @param {string[]} options.components - An array of component names to stop.
 * @param {Object} options - Additional options.
 * @param {string} options.component_root_dir - The root directory containing the components.
 * @returns {void}
 */

const stopApps = async ({ components, options }) => {
    const {
        component_root_dir: apps_dir,
    } = await getComponentDirecotories({
        components,
        component_type: 'app'
    })
    // TODO: handle case where no app is specified. component.length === 0 and if -k or --kill command is passed
    spawn('docker', ['compose', '-f', `${apps_dir}/${components}/docker-compose.dev.yml`, 'down'], { stdio: 'inherit' })
}

/**
 * Prunes docker artifacts.Abstraction to docker [system,volume] prune --help
 * @param {Object} options - Options for Docker pruning.
 * @param {boolean} options.volume - If true, this command targets docker volumes; otherwise, system.
 * @param {boolean} options.all - If true, this command prunes system & volume artifacts.
 * @param {boolean} options.force - If true, does not prompt for confirmation.
 * @returns {void}
 */
const dockerPrune = ({ volume, all, force }) => {
    if (volume && all) {
        logError({ error: 'Use all or volume not both' })
        exit(1)
    }
    if (all) {
        const pruneSystem = spawn('docker', ['system', 'prune', '-a', '-f'], { stdio: 'inherit' });
        const pruneVolume = spawn('docker', ['volume', 'prune', '-a', '-f'], { stdio: 'inherit' });

        pruneSystem.on('exit', (code) => {
            if (code === 0) {
                logSuccess({ message: 'Docker system prune successful' });
            } else {
                logError({ error: `Docker system prune failed with code ${code}` });
            }
        });

        pruneVolume.on('exit', (code) => {
            if (code === 0) {
                logSuccess({ message: 'Docker volume prune successful' });
            } else {
                logError({ error: `Docker volume prune failed with code ${code}` });
            }
        });
    }
    if (volume) {
        const pruneVolume = spawn('docker', ['volume', 'prune', '-a', ...(force ? ['-f'] : [])], { stdio: 'inherit' });
        pruneVolume.on('exit', (code) => {
            if (code === 0) {
                logSuccess({ message: 'Docker volume prune successful' });
            } else {
                logError({ error: `Docker volume prune failed with code ${code}` });
            }
        });
    }
    if (!volume && !all) {
        const pruneSystem = spawn('docker', ['system', 'prune', '-a', ...(force ? ['-f'] : [])], { stdio: 'inherit' });
        pruneSystem.on('exit', (code) => {
            if (code === 0) {
                logSuccess({ message: 'Docker system prune successful' });
            } else {
                logError({ error: `Docker system prune failed with code ${code}` });
            }
        });
    }

}


/**
 * Adds initial minimal dependencies and installs at microservice workspace and shared workspace.
 * @param {Object} options - Options for adding package.json.
 * @param {Object} options.answers - Answers containing information for configuring the package.json.
 * @param {string} options.answers.project_base - The base project directory.
 * @param {string} options.answers.repo_name - The name of the repository.
 * @param {string} options.project_root - The root directory of the project.
 * @returns {void}
 */
const addPackageJson = async ({ project_root, answers }) => {
    // Add a package.json 
    writeFileSync(join(project_root, 'package.json'), JSON.stringify(assets.rootPackageJsonContent({ answers, os }), null, 2));

    // TODO: move these dependencies to assets
    const dependencies = [
        `${answers.project_base}/config@1.0.0`,
        `${answers.project_base}/errors@1.0.0`,
        `${answers.project_base}/utilities@1.0.0`,
        `${answers.project_base}/middlewares@1.0.0`,
        `${answers.project_base}/broker@1.0.0`,
        "dotenv",
        "express",
        "helmet",
        "morgan",
        "winston",
        "mongoose"
    ];
    const devDependencies = ["nodemon", "jest"];
    const configDependencies = ['dotenv', 'joi', 'morgan', 'winston']
    const utilitiesDependencies = ['joi']
    const brokerDependencies = ['amqplib']
    // Join dependencies into a single string for the command
    const depsCommand = dependencies.join(' ');
    const devDepsCommand = devDependencies.join(' ');



    // Creating a spinner
    // const spinner = ora(`Project ${answers.repo_name} created successfully!`).start();
    const spinner = ora(`Initializing new suite project @ ${join(cwd(), answers.repo_name)}`).start();
    await new Promise(resolve => setTimeout(resolve, 10));
    exec(`cd ${answers.repo_name} && git init`)
    spinner.text = 'Initializing git...';

    // Delay before updating spinner for next phase
    await new Promise(resolve => setTimeout(resolve, 1));
    spinner.color = 'yellow'; // Change spinner color
    spinner.text = 'Installing dependencies...';

    // Delay before executing yarn commands
    await new Promise(resolve => setTimeout(resolve, 1));
    const command = `yarn workspace ${answers.project_base}/${answers.service_name} add ${depsCommand} && yarn workspace ${answers.project_base}/${answers.service_name} add -D ${devDepsCommand} && yarn workspace ${answers.project_base}/utilities add ${utilitiesDependencies} && yarn workspace ${answers.project_base}/config add ${configDependencies.join(' ')} && yarn workspace ${answers.project_base}/broker add ${brokerDependencies}`;

    // Execute the command
    const childProcess = spawn(command, {
        cwd: project_root,
        shell: true,
    });



    childProcess.stdout.on('data', data => {
        const output = data.toString();
        // Check for different stages
        if (output.includes('[1/4] Resolving packages...')) {
            spinner.text = 'Resolving packages...';
        } else if (output.includes('[2/4] Fetching packages...')) {
            spinner.text = 'Fetching packages...';
        } else if (output.includes('[3/4] Linking dependencies...')) {
            spinner.text = 'Linking dependencies...';
        } else if (output.includes('[4/4] Building fresh packages...')) {
            spinner.text = 'Building packages...';
        } else {
            const match = output.match(/├─ ([\w@/.-]+)\s/);
            if (match) {
                spinner.text = `Installed ${match[1]}`;
            }
        }
    });
    let warningMessage
    childProcess.stderr.on('data', data => {
        const output = data.toString();
        logInfo({ message: output });
        if (output.toLowerCase().includes('warning')) {
            warningMessage = output.split('\n').find(line => line.toLowerCase().includes('warning'));
        } else {
            spinner.text = 'Encountered an issue, check logs for more info.';
        }
    });

    childProcess.on('error', error => {
        spinner.fail('Failed to execute command');
    });
    // TODO: check if yarn is installed first
    childProcess.on('exit', (code, signal) => {
        if (code !== 0) {
            spinner.fail('Command failed to complete successfully');
            return;
        }
        spinner.stop()
        if (warningMessage) {
            console.log('============================')
            console.warn(warningMessage)
            console.log('============================')
        }
        spinner.succeed('Dependencies installed successfully');
        spinner.info(`To start the project, run 'cd ${answers.repo_name} && suite start -v ${answers.service_name}'`)
    });
}

/**
 * Adds initial minimal dependencies and installs at microservice workspace and shared workspace.
 * @param {Object} options - Options for adding a microservice.
 * @param {string} options.project_root - The root directory of the project.
 * @param {Object} options.answers - Answers containing information for configuring the microservice.
 * @param {string} options.answers.webserver - The web server to be used.
 * @param {string} options.answers.apis - The APIs protocols to be used.
 * @param {string} options.answers.license - The license for the microservice.
 * @param {string} options.answers.project_base - The base project directory.
 * @param {string} options.answers.repo_name - The name of the project.
 * @returns {void}
 */
const addMicroservice = ({ project_root, answers }) => {
    const directories = assets.fileStructureContent({ answers })
    directories.forEach((dir) => {
        const current_dir = `${project_root}/${dir}`
        if (dir !== `REST/app1`) mkdirSync(current_dir, { recursive: true });
        switch (dir) {
            case `shared/config`:
                writeFile(join(current_dir, 'config.js'), assets.configConfigContent());
                writeFile(join(current_dir, 'index.js'), assets.configIndexContent());
                writeFile(join(current_dir, 'logger.js'), assets.configLoggerContent());
                writeFile(join(current_dir, 'morgan.js'), assets.configMorganContent());
                writeFile(join(current_dir, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
                    addDeps: false,
                    answers,
                    suffix: 'config',
                    isMicroservice: false,
                    os,
                    description: "This contains common configurations for things like env files,loggers etc for easy setup of environment specific settings"
                }), null, 2));
                writeFile(join(current_dir, 'README.md'), assets.configReadmeContent({ answers }));
                break;
            case `shared/errors`:
                writeFile(join(current_dir, 'errors.handler.js'), assets.errorHandlerContent());
                writeFile(join(current_dir, 'index.js'), assets.errorIndexContent());
                writeFile(join(current_dir, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
                    addDeps: false,
                    answers,
                    suffix: 'errors',
                    isMicroservice: false,
                    os,
                    description: "This is the global error handler for handling error messages in development and production environments"
                }), null, 2));
                writeFile(join(current_dir, 'README.md'), assets.errorReadmeContent({ answers }));
                break;
            case `shared/utilities`:
                writeFile(join(current_dir, 'APIError.js'), assets.apiErrorContent());
                writeFile(join(current_dir, 'index.js'), assets.utilitiesIndexContent());
                writeFile(join(current_dir, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
                    addDeps: false,
                    answers,
                    suffix: 'utilities',
                    isMicroservice: false,
                    os,
                    description: ""
                }), null, 2));
                writeFile(join(current_dir, 'README.md'), assets.utilitiesReadmeContent({ answers }));
                writeFile(join(current_dir, 'pick.js'), assets.utilitiesPickContent());
                writeFile(join(current_dir, 'validate.js'), assets.utilitiesValidateContent());
                writeFile(join(current_dir, 'asyncErrorHandler.js'), assets.utilitiesAsyncErrorHandlerContent());
                break;
            case `shared/middlewares`:
                writeFile(join(current_dir, 'index.js'), assets.middlewaresIndexContent());
                writeFile(join(current_dir, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
                    addDeps: false,
                    answers,
                    suffix: 'middlewares',
                    isMicroservice: false,
                    os,
                    description: ""
                }), null, 2));
                writeFile(join(current_dir, 'README.md'), assets.middlewaresReadmeContent({ answers }));
                break;
            case `shared/broker`:
                const broker_dir = join(current_dir, 'rabbitmq'); //TODO: add support for kafka,aws sqs and more
                mkdirSync(broker_dir, { recursive: true })
                writeFile(join(broker_dir, 'exchange.js'), assets.brokerExchangeContent({ answers }));
                writeFile(join(broker_dir, 'index.js'), assets.brokerIndexContent());
                writeFile(join(current_dir, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
                    addDeps: false,
                    answers,
                    suffix: 'broker',
                    isMicroservice: false,
                    os,
                    description: ""
                }), null, 2));
                writeFile(join(current_dir, 'README.md'), assets.brokerReadmeContent({ answers }));
                writeFile(join(broker_dir, 'publisher.js'), assets.brokerPublisherContent({ answers }));
                writeFile(join(broker_dir, 'subscriber.js'), assets.brokerSubscriberContent());
                writeFile(join(broker_dir, 'worker.queue.js'), assets.brokerWorkerQueueContent({ answers }));
                break;
            case `tests/${answers.service_name}/e2e`:
                writeFile(join(current_dir, 'test1.js'), assets.e2eTestContent({ answers }));
                break;
            case `tests/${answers.service_name}/integration`:
                writeFile(join(current_dir, 'test1.js'), assets.integrationTestContent());
                break;
            case `tests/${answers.service_name}/unit`:
                writeFile(join(current_dir, 'test1.js'), assets.unitTestContent());
                break;
            case `tests/${answers.service_name}/snapshot`:
                writeFile(join(current_dir, 'test1.js'), assets.snapshotTestContent());
                break;
            case `GraphQL/app1`:
                writeFile(join(current_dir, 'appollo-server.js'), assets.apolloServerContent({ answers }));
                break;
            case `k8s`:
                // TODO: move k8s into a function 
                writeFile(join(current_dir, 'README.md'), assets.k8sReadmeContent({ answers }));
                break;
        }
    });

    generateMCSHelper({ project_root, answers })
    mkdirSync(join(project_root, '.vscode'), { recursive: true })
    writeFileSync(join(project_root, '.gitignore'), assets.gitignoreContent());
    writeFileSync(join(project_root, '.vscode', 'launch.json'), JSON.stringify(assets.debuggerConfigContent(), null, 2));
    writeFileSync(join(project_root, '.gitignore'), assets.gitignoreContent());
    mkdirSync(join(project_root, '.vscode'), { recursive: true })
    writeFileSync(join(project_root, '.vscode', 'launch.json'), JSON.stringify(assets.debuggerConfigContent(), null, 2));
    writeFile(join(`${project_root}/microservices/${answers.service_name}`, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
        addDeps: false,
        answers,
        suffix: `${answers.service_name}`,
        isMicroservice: true,
        os,
        description: `This is the ${answers.service_name} service listening at http://localhost:9001. TODO: update this description`
    }), null, 2));

}


/**
 * Scaffolds a new project generating suite standard file structure with initial boiler plate.
 * @async
 * @param {Object} options - Options for scaffolding the project.
 * @param {Object} options.answers - Answers containing information for configuring the project.
 * @param {string} options.answers.service_name - The name of the initial sample service.
 * @param {boolean} options.answers.private - Indicates whether the project is private.
 * @returns {void}
 */
const scaffoldNewRepo = async ({ answers }) => {
    try {
        project_root = generateRootPath({ currentDir: cwd() });
    } catch (error) {
        // Not within a suite repo
        if (error.message && error.message === 'suite.json and(or) .git not found') {
            mkdirSync(join(cwd(), answers.repo_name), { recursive: true });
            addProjectConfigs({ project_root: join(cwd(), answers.repo_name), answers })
            addMicroservice({ project_root: join(cwd(), answers.repo_name), answers })
            addPackageJson({ project_root: join(cwd(), answers.repo_name), answers })

            return
        }
        else {
            // rethrow the error
            throw new Error('Error code 10005.Kindly raise an issue at https://github.com/microservices-suite/node-microservices-suite/issues')
        }
    }
    ora('This looks like a suite repo. Do you want to reinitialize?').warn()
    // TODO: suite init to check for existing errors and fix
    ora().info('Run <suite init> to reinitialize this project')
    exit(1)
}

/**
 * Scaffolds a new service generating suite standard mcs file structure with initial boiler plate
 * @param {Object} options 
 * @param {Object} options.answers additional options
 * @param {string} options.answers.service_name Name of the service to generate
 * @returns void
 */
const scaffoldNewService = async ({ answers }) => {
    let project_root;
    try {
        project_root = generateRootPath({ currentDir: cwd() });
    } catch (error) {
        // Not within a suite repo
        if (error.message && error.message === 'suite.json and(or) .git not found') {
            ora('This does not look like a suite repo').warn()
            ora().info('If it is run <suite init> from project root to reinitialize suite project and try again')
            exit(1)
        }
        else {
            // rethrow the error
            throw new Error('Error code 10005.Kindly raise an issue at https://github.com/microservices-suite/node-microservices-suite/issues')
        }
    }
    const package_json_path = join(project_root, 'package.json');
    const { workspace_name } = retrieveWorkSpaceName({ package_json_path });
    const { default_broker } = readFileContent({ currentDir: cwd() })
    await injectService({
        project_root,
        answers: {
            ...answers,
            default_broker
        },
        workspace_name
    })
};

/**
 * Injects a new service into the project directory.
 * @async
 * @param {Object} options - Options for injecting the service.
 * @param {string} options.project_root - The root directory of the project.
 * @param {Object} options.answers - Answers containing information about the service.
 * @param {string} options.answers.service_name - The name of the service to inject.
 * @param {string} options.workspace_name - The name of the workspace.
 * @returns {Promise<void>} A Promise that resolves when the service is injected successfully.
 * @throws {Error} If there is an error during the injection process.
 */
const injectService = async ({ project_root, answers, workspace_name }) => {
    const spinner = ora(`Injecting service at: ${project_root}`).start();

    try {
        // Simulate a delay for the spinner
        //TODO: abstract timeout into a reusable function
        await new Promise(resolve => setTimeout(resolve, 2));

        // Generate mcs service using helper function
        generateMCSHelper({ project_root, answers: { ...answers, project_base: workspace_name } });

        // add license to package.json
        const { license } = readFileContent({ currentDir: cwd() })

        // Create service directory
        const service_path = join(project_root, 'microservices', answers.service_name);
        await mkdirSync(service_path, { recursive: true });

        // Create package.json for the service
        const packageJsonContent = assets.genericPackageJsonContent({
            addDeps: true,
            answers: { ...answers, project_base: workspace_name, license },
            suffix: `${answers.service_name}`,
            isMicroservice: true,
            os,
            description: `This is the ${answers.service_name} service. TODO: update this description`
        });

        await writeFile(join(service_path, 'package.json'), JSON.stringify(packageJsonContent, null, 2));
        registerServiceWithSuiteJson({ root_dir: project_root, name: answers.service_name, port: answers.port })
        spinner.succeed('Service injected successfully. To install dependencies run "suite install"');
    } catch (error) {
        spinner.fail(`Failed to inject service: ${error.message}`);
    }
}


/**
 * Recursively searches for the root directory containing a 'suite.json' file.
 * @param {Object} options - Options for finding the root directory.
 * @param {string} options.currentDir - The current directory to start the search from.
 * @param {number} [options.height=0] - The current recursion depth.
 * @returns {string} The path to the root directory containing 'suite.json'.
 * @throws {Error} If 'suite.json' is not found within 3 levels up from the current directory.
 */
const generateRootPath = ({ currentDir, height = 0 }) => {
    if (existsSync(join(currentDir, 'suite.json')) && existsSync(join(currentDir, '.git'))) {
        return currentDir; // Return the current directory if 'suite.json' is found

    }
    if (height < 3) {
        const parentDir = resolve(currentDir, '..');
        if (parentDir !== currentDir) {
            // Ensure we're not in the root directory 
            return generateRootPath({ currentDir: parentDir, height: height + 1 }); // Recur with the parent directory and increased height 
        }
    }

    // ora().fail('This does not look like a suite project')

    throw new Error('suite.json and(or) .git not found');
    // exit(1)
};

/**
 * Generates the necessary files for an mcs microservice.
 * @param {Object} options - Options for generating microservice files.
 * @param {string} options.project_root - The root directory of the project.
 * @param {Object} options.answers - Answers containing information about the microservice.
 * @param {string} options.answers.service_name - The name of the microservice.
 */
const generateMCSHelper = ({ project_root, answers }) => {
    ['models', 'controllers', 'routes', 'services', 'subscriber'].forEach(mcs => {
        // Correct the file extension based on directory
        const mcsPath = `${project_root}/microservices/${answers.service_name}/src/${mcs}`
        mkdirSync(mcsPath, { recursive: true })
        const fileExtension = `${mcs}.js`;

        // Write main file content
        const mainContent = mcs === 'models' ? assets.modelContent({ answers }) :
            mcs === 'routes' ? assets.routesContent({ answers }) :
                mcs === 'controllers' ? assets.controllersContent({ answers }) :
                    mcs === 'subscriber' ? assets.subscriberContent({ answers }) :
                        assets.servicesContent({ answers });
        writeFileSync(join(mcsPath, `${fileExtension}`), mainContent);
        // Write index file content
        const indexContent = mcs === 'models' ? assets.modelIndexContent() :
            mcs === 'routes' ? assets.routesIndexContent() :
                mcs === 'controllers' ? assets.controllersIndexContent() :
                    mcs === 'subscriber' ? assets.subscriberIndexContent() :
                        assets.servicesIndexContent();
        writeFileSync(join(mcsPath, 'index.js'), indexContent);
    });
    writeFile(join(`${project_root}/microservices/${answers.service_name}`, 'index.js'), assets.serverContent({ answers }));
    writeFile(join(`${project_root}/microservices/${answers.service_name}`, '.env'), assets.envContent({ answers }));
    writeFile(join(`${project_root}/microservices/${answers.service_name}`, '.dockerignore'), assets.dockerIgnoreContent());
    writeFile(join(`${project_root}/microservices/${answers.service_name}`, '.env.dev'), assets.envContent({ answers }));
    writeFile(join(`${project_root}/microservices/${answers.service_name}`, 'Dockerfile.dev'), assets.dockerfileContent());
    writeFile(join(`${project_root}/microservices/${answers.service_name}`, 'ecosystem.config.js'), assets.ecosystemContent({ answers }));
}

/**
 * Releases a package or generates a release for the workspace.
 * @async
 * @param {Object} options - Options for releasing the package.
 * @param {string} options.package - The name of the package to release (optional).
 * @returns {Promise<void>} A Promise that resolves when the release process is completed.
 */
const releasePackage = async ({ package }) => {
    try {
        const package_json_path = join(cwd(), 'package.json');

        // Read the package.json file
        const { workspace_name } = retrieveWorkSpaceName({ package_json_path });
        if (package) {
            logInfo({ message: `Looking for package: ${workspace_name}/${package}` });
            await executeCommand('yarn', ['workspace', `${workspace_name}/${package}`, 'release'], { stdio: 'inherit', shell: true });
        } else {
            await executeCommand('yarn', ['generate:release'], { cwd: cwd(), stdio: 'inherit', shell: true });
        }
    } catch (error) {
        ora().fail('Command failed to run');
    }
}

const executeCommand = (command, args, options) => {
    return new Promise(async (resolve, reject) => {
        const child = await spawn(command, args, options);
        child.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Command ${command} ${args.join(' ')} failed with code ${code}`));
            } else {
                resolve();
            }
        });
        child.on('error', (err) => {
            reject(err);
        });
    });
}


/**
 * Retrieves the workspace name from the package.json file.
 * @param {Object} options - Options for retrieving the workspace name.
 * @param {string} options.package_json_path - The path to the package.json file.
 * @returns {Object} An object containing the workspace name.
 * @throws {Error} If there is an error parsing the package.json file.
 */
const retrieveWorkSpaceName = ({ package_json_path }) => {
    // Read the package.json file
    const data = readFileSync(package_json_path, { 'encoding': 'utf8' })
    try {
        // Parse the JSON data
        const packageJson = JSON.parse(data);

        // Access the 'name' property, which is the first item listed in your package.json example
        const workspace_name = packageJson.name.split('/')[0];
        return { workspace_name }
    } catch (error) {
        logError({ error: error.message })
    }
}

/**
 * Scaffold a new library within the project.
 * @async
 * @param {Object} options - Options for scaffolding the library.
 * @param {Object} options.answers - Answers containing information about the library.
 * @param {string} options.answers.library_name - The name of the library to scaffold.
 * @returns {Promise<void>} A Promise that resolves when the library is scaffolded successfully.
 */
const scaffoldNewLibrary = async ({ answers }) => {
    const project_root = join(cwd(), 'shared', answers.library_name);
    const package_json_path = join(cwd(), 'package.json')
    // add license to package.json
    const { license } = readFileContent({ currentDir: cwd() })
    mkdirSync(project_root, { recursive: true });
    const { workspace_name } = retrieveWorkSpaceName({ package_json_path })
    writeFile(join(`${project_root}`, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
        addDeps: false,
        answers: { ...answers, project_base: workspace_name, license },
        suffix: `${answers.library_name}`,
        isMicroservice: false,
        os,
        description: `This is the ${answers.library_name} library. TODO: update this description`
    }), null, 2));
}

/**
 * Adds initial minimal dependencies and installs at microservice workspace and shared workspace.
 * @param {Object} options - Options for adding initial minimal dependencies and installing at workspaces.
 * @param {Object} options.answers - Answers containing information for configuring the project.
 * @param {string} options.answers.project_base - The base directory of the project.
 * @param {string} options.answers.repo_name - The name of the project.
 * @param {string} options.project_root - The root directory of the project.
 * @returns {void}
 */
const addProjectConfigs = ({ project_root, answers }) => {
    const { service_name, port, ...suite_json } = answers
    suite_json['services'] = [
        {
            name: service_name,
            port: answers.port
        }
    ]
    answers.apis.includes('GraphQL') && (suite_json['apollo_servers'] = [{
        name: 'app1',
        port: (answers.port + 1000) < 5000 ? 4001 : 8001
    }])
    writeFile(join(project_root, 'suite.json'), JSON.stringify(assets.suiteJSON({ answers: suite_json }), null, 2));
    writeFile(join(project_root, 'suite.config'), assets.suiteConfig({ answers }));
    writeFile(join(project_root, '.suiterc'), assets.suiteRC({ answers }));

}

// Function to get the next available port
const getNextAvailablePort = ({ key, port }) => {
    const used_ports = key.map(k => k[port]).sort((a, b) => a - b);
    let last_port = used_ports[used_ports.length - 1] || 9000
    return last_port + 1;
};

const getExistingComponent = ({ key, currentDir }) => {
    const fileContent = readFileContent({ currentDir });
    // Access the dynamic key from fileContent
    return fileContent[key];  // Dynamically access the key in the object
};

const getExistingApps = ({ currentDir }) => {
    const { apps } = readFileContent({ currentDir });
    return apps
}

const registerServiceWithSuiteJson = ({ root_dir, name, port }) => {
    // Read the project configuration file
    const configPath = resolve(root_dir, 'suite.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    if (!config.services) {
        config.services = [];
    }
    const idx = config.services.findIndex((s) => s.name === name);
    if (idx !== -1) {
        config.services[idx] = { name, port }
    }
    else {
        config.services.push({ name, port });
    }

    // keep the services ordered by port
    config.services.sort((a, b) => a.port - b.port);
    writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
}

const registerAppWithSuiteJson = ({ root_dir, name, services, port }) => {
    // Read the project configuration file
    const configPath = resolve(root_dir, 'suite.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    const services_names = services.map((s) => s.name);
    if (!config.apps) {
        config.apps = [];
    }
    const idx = config.apps.findIndex((a) => a.name === name);
    if (idx !== -1) {
        config.apps[idx] = { name, GATEWAY_PORT: port, services: services_names }
    }
    else {
        config.apps.push({ name, GATEWAY_PORT: port, services: services_names });
    }

    // keep the apps ordered by names
    config.apps.sort((a, b) => a.name - b.name);
    writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
}
/**
 * Releases a package or generates a release for the workspace.
 * @async
 * @param {Object} options - Options for releasing the package.
 * @param {string} options.package - The name of the package to release (optional).
 * @returns {Promise<void>} A Promise that resolves when the release process is completed.
 */
const test = async ({ package }) => {
    let rootDir = cwd();
    if (!package) {
        rootDir = generateRootPath({ currentDir: cwd() });
    }
    try {
        const package_json_path = join(rootDir, 'package.json');

        // Read the package.json file
        const { workspace_name } = retrieveWorkSpaceName({ package_json_path });
        if (package) {
            logInfo({ message: `Looking for package: ${workspace_name}/${package}` });
            await executeCommand('yarn', ['workspace', `${workspace_name}/${package}`, 'test'], { stdio: 'inherit', shell: true });
        } else {
            await executeCommand('yarn', ['test'], { cwd: rootDir, stdio: 'inherit', shell: true });
        }
    } catch (error) {
        ora().fail('Command failed to run');
    }
}
const generateK8sBroker = ({ broker_directory }) => {
    writeFileSync(join(broker_directory, 'deployment.yaml'), assets.k8sClusterDeploymentContent({
        service: 'rabbitmq',
        image: 'rabbitmq:3.13-management',
        ports: [5672, 15672]
    })
    )
    writeFileSync(join(broker_directory, 'clusterIp.yaml'), assets.k8sClusterIpContent({
        service: 'rabbitmq',
        ports: [
            { name: 'server', port: 5672, targetPort: 5672 },
            { name: 'management', port: 15672, targetPort: 15672 }
        ]
    })
    )
    writeFileSync(join(broker_directory, 'loadBalancer.yaml'), assets.k8sLoadBalancerContent({
        service: 'rabbitmq',
        ports: [
            { name: 'server', port: 5672, targetPort: 5672, nodePort: 30001 },
            { name: 'management', port: 15672, targetPort: 15672, nodePort: 30002 }
        ]
    })
    )
    writeFileSync(join(broker_directory, 'nodePort.yaml'), assets.k8sNodePortContent({
        service: 'rabbitmq',
        ports: [
            { name: 'server', port: 5672, targetPort: 5672, nodePort: 30001 },
            { name: 'management', port: 15672, targetPort: 15672, nodePort: 30002 }
        ]
    })
    )
}
const generateK8sApp = ({ namespace, app_name, k8s_directory, projectName, services = [] }) => {
    const app_directory = k8s_directory
    // Remove the directory if it already exists
    if (existsSync(app_directory)) {
        rmSync(app_directory, { recursive: true });
    }
    const nodePort = 30003
    services.forEach((s, i) => {
        const dirs = s.remote ?['server'] : ['db','server'];
        dirs.forEach((_, j) => {
            const _dir = join(app_directory, s.name, _);
            mkdirSync(_dir, { recursive: true });
            const service_name = _ === 'db' ? 'mongodb' : s.name
            const port = _ === 'db' ? '27017' : s.port
            const image = _ === 'db' ? 'mongo' : `${projectName}/${s.name}:latest`
            const loadBalancerPort = nodePort + (i * 2) + (j * 10);
            writeFileSync(join(_dir, 'deployment.yaml'), assets.k8sClusterDeploymentContent({
                service: service_name,
                image,
                ports: [port]
            })
            )
            writeFileSync(join(_dir, 'clusterIp.yaml'), assets.k8sClusterIpContent({
                service: service_name,
                ports: [
                    { name: service_name, port: port, targetPort: port },
                ]
            })
            )
            writeFileSync(join(_dir, 'loadBalancer.yaml'), assets.k8sLoadBalancerContent({
                service: service_name,
                ports: [
                    { name: service_name, port: port, targetPort: port, nodePort: loadBalancerPort },
                ]
            })
            )
            writeFileSync(join(_dir, 'nodePort.yaml'), assets.k8sNodePortContent({
                service: service_name,
                ports: [
                    { name: service_name, port: port, targetPort: port, nodePort: loadBalancerPort + 1 },
                ]
            })
            )

            const service_dir = join(app_directory, s.name)
            writeFileSync(join(service_dir, 'configMap.yaml'), assets.k8sConfigMapContent({
                service: s.name,
                port: s.port,
                project_base: projectName,
                env: 'prod',
                namespace: namespace || 'default',
                app: app_name
            })
            )
            writeFileSync(join(service_dir, 'secret.yaml'), assets.k8sSecretContent({
                service: s.name
            })
            )
        })
    })
    writeFileSync(join(app_directory, 'combo.yaml'), assets.k8sComboContent({
        project_base: projectName,
        app: app_name,
        services: services.map((s) => ({ service: s.name, port: s.port, image: `${projectName}/${s.name}:latest` }))
    })
    )
}

const injectSREConfigs = async ({ app_directory, answers, relativeKrakendDir, krakend_dir, projectName }) => {
    const directories = assets.sreTreeContent()
    directories.forEach((dir) => {
        for (const dir_ of dir.subdirectories) {
            const current_dir = `${app_directory}/telemetry/${dir.directory}/${dir_}`
            mkdirSync(current_dir, { recursive: true });
            switch (`${dir.directory}/${dir_}`) {

                case 'grafana/dashboards':
                    writeFile(join(current_dir, 'all.yaml'), assets.grafanaDashboardYamlContent());
                    break;

                case 'grafana/datasources':
                    writeFile(join(current_dir, 'all.yaml'), assets.grafanaDatasourcesYamlContent());
                    break;

                case 'grafana/krakend':
                    writeFile(join(current_dir, 'dashboard.json'), assets.grafanaKrakendDashboardJsonContent({ app_name: answers.app_name }));
                    break;

                case 'krakend/partials':
                    writeFile(join(current_dir, 'extra_config.tmpl'), assets.krakendPartialsExtraConfContent({app_name: answers.app_name}));
                    writeFile(join(current_dir, 'input_headers.tmpl'), assets.krakendPartialsInputHeadersContent());
                    writeFile(join(current_dir, 'rate_limit_backend.tmpl'), assets.krakendPartialsRateLimitBackendContent());
                    break;

                case 'krakend/settings':
                    mkdirSync(join(current_dir, 'dev'), { recursive: true });
                    mkdirSync(join(current_dir, 'prod'), { recursive: true });
                    writeFile(join(current_dir, 'dev/env.json'), assets.krakendSettingsDevEnvJsonContent({ answers }));
                    writeFile(join(current_dir, 'prod/env.json'), assets.krakendSettingsProdEnvJsonContent({ answers }));
                    writeFile(join(current_dir, 'dev/loop_example.json'), assets.krakendSettingsDevLoopExampleJsonContent());
                    writeFile(join(current_dir, 'prod/loop_example.json'), assets.krakendSettingsProdLoopExampleJsonContent());
                    break;

                case 'krakend/templates':
                    writeFile(join(current_dir, 'sample_template.tmpl'), assets.krakendTemplatesContent());
                    break;
            }

        }

    });
    mkdirSync(`${app_directory}/telemetry/elastic`, { recursive: true });
    mkdirSync(`${app_directory}/telemetry/logstash`, { recursive: true });
    writeFile(join(`${app_directory}/telemetry/logstash`, 'logstash.conf'), assets.logstashConfContent());
    writeFile(join(`${app_directory}/telemetry/krakend`, 'krakend-flexible-config.tmpl'), assets.krakenFlexibleConfigContent({ answers }));
    writeFile(join(`${app_directory}/telemetry/krakend`, 'krakend.json'), assets.krakenJsonContent({
        services: answers.services,
        krakend_dir,
        projectName,
        gateway_port: answers.gateway_port,
        api_version: answers.api_version,
        gateway_cache_period: answers.gateway_cache_period,
        gateway_timeout: answers.gateway_timeout,
        relativeKrakendDir,
        app_name: answers.app_name
    }));
    writeFile(join(`${app_directory}`, '.env'), assets.dockerComposeEnvContent());
    await readAndWriteDashboardFile(app_directory, answers);

}
const scaffoldApp = ({ answers }) => {
    const { webserver, projectName, services } = readFileContent({ currentDir: cwd() });
    const project_root = generateRootPath({ currentDir: cwd() });
    const app_directory = join(project_root, 'docker/apps', answers.app_name);
    const telemetry_directory = join(app_directory, 'telemetry');
    const k8s_directory = join(project_root, `k8s/ns/${answers?.namespace || 'default'}`, answers.app_name);

    const webserver_dir = join(app_directory, webserver);
    const krakend_dir = join(app_directory, 'krakend');
    const data_dir = join(app_directory, 'data');
    if (existsSync(k8s_directory)) {
        rmSync(k8s_directory, { recursive: true });

    }

    const ingress_directory = join(project_root, `k8s/ingress`);
    const broker_directory = join(project_root, `k8s/broker`);
    mkdirSync(ingress_directory, { recursive: true });
    mkdirSync(broker_directory, { recursive: true });

    generateK8sBroker({ broker_directory, projectName });
    writeFileSync(join(ingress_directory, 'ingress.yaml'), assets.k8sIngressContent({
        project_base: projectName,
        app: answers.app_name,
        services
    }));
    generateK8sApp({
        app_name: answers?.app_name,
        namespace: answers?.namespace,
        k8s_directory,
        projectName,
        services: answers.services
    })

    // Remove the directory if it already exists
    if (existsSync(app_directory)) {
        rmSync(app_directory, { recursive: true });
    }
    mkdirSync(webserver_dir, { recursive: true });
    mkdirSync(krakend_dir, { recursive: true });
    mkdirSync(data_dir, { recursive: true });

    writeFileSync(join(app_directory, 'docker-compose.dev.yml'), assets.dockerComposeContent({
        services: answers.services,
        app_name: answers.app_name,
        webserver,
        krakend_port: answers.gateway_port,
        env: 'dev'
    }));
    writeFileSync(join(app_directory, 'docker-compose.yml'), assets.dockerComposeContent({
        services: answers.services,
        app_name: answers.app_name,
        webserver,
        krakend_port: answers.gateway_port,
        env: 'prod'
    }));
    writeFileSync(join(app_directory, 'Makefile'), assets.makeFileContent());
    const relativeAppDir = path.relative(project_root, app_directory);
    const relativeK8sDir = path.relative(project_root, k8s_directory);
    const relativeWebServerDir = path.relative(project_root, webserver_dir);
    const relativeKrakendDir = path.relative(project_root, krakend_dir);

    // add telemetry configurations to app
    if (!existsSync(telemetry_directory)) {
        injectSREConfigs({ app_directory, answers, relativeKrakendDir, krakend_dir, projectName });
    }
    ora().succeed(`Generated docker-compose configs at: ./${relativeAppDir}`);
    ora().succeed(`Generated kubernetes configs at: ./${relativeK8sDir}`);
    switch (webserver) {
        case 'nginx':
            generateNginxConfiguration({ services: answers.services, webserver_dir, relativeWebServerDir });
            break
        default:
            ora().info('Handling other webservers');
    }
    generateKrakendConfiguration({
        services: answers.services,
        krakend_dir,
        projectName,
        gateway_port: answers.gateway_port,
        api_version: answers.api_version,
        gateway_cache_period: answers.gateway_cache_period,
        gateway_timeout: answers.gateway_timeout,
        relativeKrakendDir
    });
    registerAppWithSuiteJson({ root_dir: project_root, name: answers.app_name, services: answers.services, port: answers.port })

}
const readFileContent = ({ currentDir }) => {
    const root_dir = generateRootPath({ currentDir, height: 5 })
    // Read the project configuration file
    const configPath = resolve(root_dir, 'suite.json');
    const project_config = JSON.parse(readFileSync(configPath, 'utf8'));
    return project_config
}

const generateNginxConfiguration = ({ services, webserver_dir, relativeWebServerDir }) => {
    writeFileSync(join(webserver_dir, 'default.conf'), assets.nginxContent({ services }));
    writeFile(join(webserver_dir, 'Dockerfile'), assets.nginxDockerfileContent());
    writeFile(join(webserver_dir, 'Dockerfile.dev'), assets.nginxDockerfileContent());
    ora().succeed(`Generated webserver configs at: ./${relativeWebServerDir}`)
}
const generateKrakendConfiguration = ({
    services,
    krakend_dir,
    projectName,
    gateway_port,
    api_version,
    gateway_cache_period,
    gateway_timeout,
    relativeKrakendDir
}) => {
    writeFile(join(krakend_dir,
        'krakend.json'),
        assets.krakendConfigContent({
            services,
            projectName,
            gateway_port,
            api_version,
            gateway_cache_period,
            gateway_timeout
        }));
    ora().succeed(`Generated krakend gateway configs at: ${relativeKrakendDir}`)
}
const installDependencies = async ({ project_base, workspace, spinner, deps, flags }) => {



    // Delay before updating spinner for next phase
    await new Promise(resolve => setTimeout(resolve, 1));
    spinner.color = 'yellow'; // Change spinner color
    spinner.text = 'Installing dependencies...';

    // Delay before executing yarn commands
    await new Promise(resolve => setTimeout(resolve, 1));
    const command = `yarn workspace ${project_base}/${workspace} add ${depsCommand} ${flags.join(' ')}`

    // Execute the command
    const childProcess = spawn(command, {
        cwd: project_root,
        shell: true,
    });

    childProcess.stdout.on('data', data => {
        const output = data.toString();
        // Check for different stages
        if (output.includes('[1/4] Resolving packages...')) {
            spinner.text = 'Resolving packages...';
        } else if (output.includes('[2/4] Fetching packages...')) {
            spinner.text = 'Fetching packages...';
        } else if (output.includes('[3/4] Linking dependencies...')) {
            spinner.text = 'Linking dependencies...';
        } else if (output.includes('[4/4] Building fresh packages...')) {
            spinner.text = 'Building packages...';
        } else {
            const match = output.match(/├─ ([\w@/.-]+)\s/);
            if (match) {
                spinner.text = `Installed ${match[1]}`;
            }
        }
    });
    let warningMessage
    childProcess.stderr.on('data', data => {
        const output = data.toString();

        if (output.toLowerCase().includes('warning')) {
            warningMessage = output.split('\n').find(line => line.toLowerCase().includes('warning'));
        } else {
            console.log(data.toString())
            spinner.text = 'Encountered an issue, check logs for more info.';
        }
    });

    childProcess.on('error', error => {
        spinner.fail('Failed to execute command');
    });
    childProcess.on('exit', (code, signal) => {
        if (code !== 0) {
            spinner.fail('Command failed to complete successfully');
            return;
        }
        spinner.stop()
        if (warningMessage) {
            console.log('============================')
            console.warn(warningMessage)
            console.log('============================')
        }
        spinner.succeed('Dependencies installed successfully');
    });
}
const getDependencies = ({ type, workspace }) => {
    // Join dependencies into a single string for the command
    switch (type) {
        case 'deps':
            const dependencies = [
                `${project_base} /config@1.0.0`,
                `${project_base}/errors@1.0.0`,
                `${project_base}/utilities@1.0.0`,
                `${project_base}/middlewares@1.0.0`,
                "dotenv",
                "express",
                "helmet",
                "morgan",
                "winston",
                "mongoose"
            ];
            const deps = dependencies.join(' ');
            return {
                deps,
                workspace,
                flags: []
            }
            break
        case 'dev_deps':
            const dev_deps = devDependencies.join(' ');
            const devDependencies = ["nodemon", "jest"];
            return {
                deps: dev_deps,
                workspace,
                flags: ['-D']
            }
            break
        case 'utils':
            const utilDependencies = ['joi']
            return {
                deps: utilDependencies,
                workspace: 'utilities',
                flags: []
            }
            break
        case 'config':
            const configDependencies = ['dotenv', 'joi', 'morgan', 'winston']
            return {
                deps: configDependencies,
                workspace: 'config',
                flags: []
            }
            break
    }
}


const scaffoldGateways = async ({ answers }) => {
    const { webserver } = readFileContent({ currentDir: cwd() });
    const { projectName } = readFileContent({ currentDir: cwd() });
    let { apps } = answers;
    const project_root = generateRootPath({ currentDir: cwd() });
    const service_objects = getExistingComponent({ key: 'services', currentDir: cwd() });
    // add port to services in each app eg ['auth']=>[{name:'auth',port:9001}]
    apps = apps.map((app) => {
        app.services.map((name, i) => {
            const service_object = service_objects.find((s) => s.name === name);
            app.services[i] = { name, port: service_object.port }
        })
        return app
    })
    await Promise.all(apps.map(async (app) => {
        console.log('---------------------------------------------')
        console.log(`🦧${app.name}-gateway`)
        return scaffoldGateway({ project_root, app, answers, webserver, projectName })

    }))
}

const scaffoldGateway = ({ project_root, app, answers, webserver, projectName }) => {
    const app_directory = join(project_root, 'docker/apps', app.name);
    const webserver_dir = join(app_directory, webserver);
    const krakend_dir = join(app_directory, 'krakend');
    const services = app.services;
    // Remove the directory if it already exists
    if (existsSync(krakend_dir)) {
        rmSync(krakend_dir, { recursive: true });
    }
    mkdirSync(webserver_dir, { recursive: true });
    mkdirSync(krakend_dir, { recursive: true });
    writeFileSync(join(app_directory, 'docker-compose.dev.yml'), assets.dockerComposeContent({
        services,
        app_name: app.name,
        webserver,
        krakend_port: answers.gateway_port,
        env: 'dev'
    }));
    writeFileSync(join(app_directory, 'docker-compose.yml'), assets.dockerComposeContent({
        services,
        app_name: app.name,
        webserver,
        krakend_port: answers.gateway_port,
        env: 'prod'
    }));
    ora().succeed(`Generated docker-compose configs at: ${app_directory}`)
    switch (webserver) {
        case 'nginx':
            generateNginxConfiguration({ services, webserver_dir, relativeWebServerDir });
            break
        default:
            ora().info('Handling other webservers');
    }
    generateKrakendConfiguration({
        services,
        krakend_dir,
        projectName,
        gateway_port: answers.gateway_port,
        api_version: answers.api_version,
        gateway_cache_period: answers.gateway_cache_period,
        gateway_timeout: answers.gateway_timeout,
        relativeKrakendDir
    });

}

const removeResource = async ({ answers }) => {
    const { resource, resource_name, options } = answers;
    let project_root;

    try {
        project_root = generateRootPath({ currentDir: process.cwd() });
    } catch (error) {
        if (error.message === 'suite.json and(or) .git not found') {
            ora().warn('This does not look like a suite repo');
            ora().info('If it is, run <suite init> from the project root to reinitialize and try again');
            exit(1);
        } else {
            throw new Error('Error code 10005. Kindly raise an issue at https://github.com/microservices-suite/node-microservices-suite/issues');
        }
    }

    const spinner = ora();
    const resourceEnum = {
        library: ['shared'],
        app: ['docker', 'apps'],
        service: ['microservices'],
        gateway: ['docker', 'apps'],
        k8s: ['k8s']
    };

    if (!resourceEnum[resource]) {
        spinner.warn(`Unknown resource type: ${resource}`);
        return;
    }
    if (options.all) {
        const allResourceChildrenPath = path.join(project_root, ...resourceEnum[resource]);
        if (resource === 'app') {
            const kubeNamespacePaths = glob.sync(path.join(project_root, 'k8s', 'ns', '*'));
            // Check if the app exists in Docker or Kubernetes directories
            const kubeExists = kubeNamespacePaths.length > 0;
            if (kubeExists) {
                kubeNamespacePaths.forEach((appKubePath) => {
                    rmSync(appKubePath, { recursive: true, force: true });
                    ora().info(`Kubernetes apps have been removed.`);
                });
            }
        }
        if (!fs.existsSync(allResourceChildrenPath)) {
            spinner.warn(`No ${resource}(s) found.`);
            // return;
        }

        const resources = fs.readdirSync(allResourceChildrenPath);
        if (resources.length === 0) {
            spinner.warn(`No ${resource}(s) found.`);
            // return;
        }

        resources.forEach(res => {
            const fullPath = path.join(allResourceChildrenPath, res);
            fs.rmSync(fullPath, { recursive: true, force: true });
        });
        spinner.succeed(`All ${resource}(s) have been removed.`);
        updateSuiteJson(project_root, resource, resources);
        return;
    }

    // Single resource removal case
    switch (resource) {
        case 'service':
            await removeService({ service_name: resource_name, project_root });
            break;
        case 'app':
            await removeApp({ app_name: resource_name, project_root });
            break;
        case 'library':
            await removeLibrary({ library_name: resource_name, project_root });
            break;
        case 'gateway':
            await removeGateway({ gateway_name: resource_name, project_root });
            break;
        default:
            throw new Error(`Unknown resource type: ${resource}`);
    }

    updateSuiteJson(project_root, resource, resource_name);
    spinner.succeed(`Resource "${resource_name}" of type "${resource}" has been removed successfully.`);
};

/**
 * Updates the suitejson configuration after removing one or more resources.
 * @param {string} project_root - The root directory of the project.
 * @param {string} resource - The type of resource to remove (e.g., 'service', 'app').
 * @param {string|string[]} resource_name - The name(s) of the resource(s) to remove.
 */
const updateSuiteJson = (project_root, resource, resource_name) => {
    const suiteJsonPath = path.join(project_root, 'suite.json');
    const suiteJson = JSON.parse(fs.readFileSync(suiteJsonPath, 'utf8'));
    const namesToRemove = Array.isArray(resource_name) ? resource_name : [resource_name];
    switch (resource) {
        case 'service':
            // Remove each service and clean up associated app services
            suiteJson.services = suiteJson.services.filter(
                service => !namesToRemove.includes(service.name)
            );
            suiteJson.apps.forEach(app => {
                app.services = app.services.filter(
                    service => !namesToRemove.includes(service)
                );
            });
            ora().info(`Service(s) "${namesToRemove.join(', ')}" removed from suitejson`);
            break;
        case 'app':
            // Remove each specified app
            suiteJson.apps = suiteJson.apps.filter(
                app => !namesToRemove.includes(app.name)
            );
            ora().info(`App(s) "${namesToRemove.join(', ')}" removed from suitejson`);
            break;
        case 'library':
            // Implement library removal if needed.
            ora().info(`Library "${namesToRemove.join(', ')}" removed from suitejson`);
            break;
        case 'gateway':
            // Implement gateway removal if needed.
            ora().info(`Gateway "${namesToRemove.join(', ')}" removed from suitejson`);
            break;
        default:
            throw new Error(`Unknown resource type: ${resource}`);
    }

    fs.writeFileSync(suiteJsonPath, JSON.stringify(suiteJson, null, 2));
    ora().info('suitejson updated successfully');
};


/**
 * Removes a microservice and all associated files.
 * @param {Object} options - Options for removing the microservice.
 * @param {string} options.project_root - The root directory of the project.
 * @param {string} options.service_name - The name of the microservice to be removed.
 * @param {boolean} [options.all] - If true, remove all services of the specified type.
 */
const removeService = async ({ service_name, project_root }) => {
    const servicePath = path.join(project_root, 'microservices', service_name);
    const spinner = ora(`Removing microservice "${service_name}"...`).start();

    try {
        // Check if the specific service exists
        if (!fs.existsSync(servicePath)) {
            spinner.warn(`Microservice "${service_name}" not found.`);
            return;
        }
        // Synchronous removal of the specific service
        fs.rmSync(servicePath, { recursive: true, force: true });
        spinner.succeed(`Microservice "${service_name}" and all associated files have been removed.`);

    } catch (error) {
        spinner.fail(`Error while removing microservice "${service_name}": ${error.message}`);
    }
};

/**
 * Removes an app from both Docker and Kubernetes directories.
 * @param {Object} options - Options for removing the app.
 * @param {string} options.app_name - The name of the app to be removed.
 * @param {string} options.project_root - The root directory of the project.
 */
const removeApp = async ({ app_name, project_root }) => {
    const appDockerPath = path.join(project_root, 'docker', 'apps', app_name);

    // Use glob to locate Kubernetes namespace directories with `app_name`
    const kubeNamespacePaths = glob.sync(path.join(project_root, 'k8s', 'ns', '*', app_name));
    // Check if the app exists in Docker or Kubernetes directories
    const dockerExists = existsSync(appDockerPath);
    const kubeExists = kubeNamespacePaths.length > 0;

    if (!dockerExists && !kubeExists) {
        ora().warn(`App "${app_name}" not found in Docker or Kubernetes.`);
        return;
    }

    try {
        // Synchronous removal
        if (dockerExists) {
            rmSync(appDockerPath, { recursive: true, force: true });
            ora().info(`Docker files for app "${app_name}" have been removed.`);
        }

        if (kubeExists) {
            kubeNamespacePaths.forEach((appKubePath) => {
                rmSync(appKubePath, { recursive: true, force: true });
                ora().info(`Kubernetes files for app "${app_name}" have been removed.`);
            });
        }
        ora().succeed(`App "${app_name}" removed successfully.`);
    } catch (error) {
        ora().fail(`Error while removing app "${app_name}": ${error.message}`);
    }
};

/**
 * Removes a microservice and all associated files.
 * @param {Object} options - Options for removing the microservice.
 * @param {string} options.project_root - The root directory of the project.
 * @param {string} options.library_name - The name of the microlibrary to be removed.
 */
const removeLibrary = async ({ library_name, project_root }) => {
    const libraryPath = path.join(project_root, 'shared', library_name);
    // Check if the microservice directory exists
    if (!existsSync(libraryPath)) {
        ora().warn(`Library "${library_name}" not found.`);
        return;
    }
    try {
        // Use synchronous removal
        rmSync(libraryPath, { recursive: true, force: true });
        ora().info(`Library "${library_name}" and all associated files have been removed.`);
        ora().succeed(`Library "${library_name}" removed successfully.`);
    } catch (error) {
        ora().fail(`Error while removing Library "${library_name}":`, error.message);
    }
};

/**
 * Removes a microservice and all associated files.
 * @param {Object} options - Options for removing the microservice.
 * @param {string} options.project_root - The root directory of the project.
 * @param {string} options.gateway - The name of the microgateway to be removed.
 */
const removeGateway = async ({ gateway, project_root }) => {
    const gatewayPath = path.join(project_root, 'apps', gateway);
    if (!existsSync(gatewayPath)) {
        ora().warn(`Gateway "${gateway}" not found.`);
        return;
    }
    try {
        // Use synchronous removal
        rmSync(gatewayPath, { recursive: true, force: true });
        ora().info(`Gateway "${gateway}" and all associated files have been removed.`);

        ora().succeed(`Gateway "${gateway}" removed successfully.`);
    } catch (error) {
        ora().fail(`Error while removing Gateway "${gateway}":`, error.message);
    }
};

const readAndWriteDashboardFile = (app_directory, answers) => {
    const outputDirectory = path.join(app_directory, 'telemetry', 'elastic');
    const filename = 'dashboard.ndjson';
    const outputPath = path.join(outputDirectory, filename);
    // Read the NDJSON file content as a string
    const krakendNdjson = readFileSync(`${__dirname}/krakend.ndjson`, 'utf8');

    // Replace all occurrences of 'KrakenD' with 'SuiteCLI/<appname>'
    const updatedContent = krakendNdjson.replace(/KrakenD/g, `🦧${answers.app_name}`);

    // Write the updated content to the new file
    writeFileSync(outputPath, updatedContent);
};

module.exports = {
    generateDirectoryPath,
    changeDirectory,
    logTitle,
    logInfo,
    logError,
    logSuccess,
    isMatch,
    getPlatform,
    checkDocker,
    startDocker,
    installDepsAtWorkspace,
    addDepsAtWorkspace,
    startAll,
    start,
    logWarning,
    startApps,
    startServices,
    pathExists,
    repoReset,
    stopApps,
    dockerPrune,
    scaffoldNewRepo,
    releasePackage,
    scaffoldNewService,
    scaffoldNewLibrary,
    getNextAvailablePort,
    getExistingComponent,
    test,
    scaffoldApp,
    scaffoldGateways,
    getExistingApps,
    readFileContent,
    removeResource,
}