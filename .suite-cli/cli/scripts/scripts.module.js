const { join, sep } = require('node:path')
const { cwd, chdir, exit } = require('node:process')
const { existsSync, statSync, readdirSync } = require('node:fs');
const { platform } = require('node:process');
let { exec } = require('node:child_process');
const chalk = require('chalk')

/**
 * Dynamically generate directory path given workspace_name
 * @param {Object} options  Options object containing workspace_name and workspace_directory
 * @param {string} options.workspace_name  Name of the workspace to cd into
 * @param {string} [options.workspace_directory]  Directory where to look for the workspace. Defaults to 'microservices'
 * @default  workspace_directory='microservice'
 * @returns {string} A full path to the workspace
 */
const generateDirectoryPath = ({ workspace_name, workspace_directory = 'microservice' }) => {
    return join(cwd(), `${workspace_directory}${sep}${workspace_name}`);
}
/**
 * The function cds into given directory_path
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
 * Prints success message to screen
 * @param {Object} options 
 * @param {string} options.message Message to display to console 
 * @returns {string}
 */
const logSuccess = ({ message }) => console.log(chalk.blue(`✓ ${message}`))

/**
 * Prints error message to screen
 * @param {Object} options
 * @param {string} options.error Error message to display to console 
 * @returns {string}
 */
const logError = ({ error }) => console.log(chalk.red(`⚠️ ${error}`))

/**
 * Prints success message to screen
 * @param {Object} options Message to display to console 
 * @param {string} options.message Message to display to console 
 * @returns {string}
 */
const logInfo = ({ message }) => console.log(chalk.gray(`✓ ${message}`))


/**
 * Prints Warning message to screen
 * @param {Object} options 
 * @param {string} options.message Warning to display to console 
 * @returns {string}
 */
const logWarning = ({ message }) => console.log(chalk.yellow(`✓ ${message}`))

/**
 * Prints advise message to screen
 * @param {Object} options 
 * @param {string} options.message advise to display to console 
 * @returns {string}
 */
const logAdvise = ({ message }) => console.log(chalk.stderr(`✓ ${message}`))

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
    return new Promise((resolve, reject) => {
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

        exec(command, async (error, stdout, stderr) => {
            if (error) {
                reject(`⇣ Install Docker to run this command: ${chalk.blue('https://docs.docker.com/engine/install/')}`);
            }
            if (await checkDocker()) {
                resolve('Docker is already running ...')
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
 * Adds dependencies at given workspace and update package.json
 * @param {Object} options Options object containing workspace_name and workspace_directory
 * @param {string} [options.components]  Name of the workspace where to add dependencies
 * @param {string} [options.options] Directory where to look for the workspace. Defaults to 'microservices'
 * @returns {string}  Returns success message
 */const start = async ({ components, options }) => {
    const type = options.app ? 'app' : 'service';
    logInfo({ message: `Starting ${components.length || 'all'} ${type}${components.length === 1 ? '' : 's'}...` });
    const useDockerCompose = options.app && !options.kubectl;

    for (const component of components) {
        const [name] = component.split(':');
        console.log({ component, options })
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
 * 
 * @param {Object} options Environment to run the 
 * @param {boolean} [options.kubectl] If true runs the app with kubectl
 * @param {boolean} [options.mode] Service environment. Defaults to dev mode
 * @param {boolean} [options.app] If true the assumes components defined are apps 
 * @returns {void} Starts all components in the existing workspaces
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
    const is_component_dir = currentDir.split(sep).includes('microservices');

    // Construct microservices directory path
    const microservicesDir = is_component_dir ?
        currentDir.split(sep).slice(0, currentDir.split(sep).indexOf('microservices') + 1).join(sep) :
        `${currentDir}${sep}microservices`;
    logInfo({ message: `cwd: ${microservicesDir}` });

    // Check if the microservices directory exists
    if (!existsSync(microservicesDir) || !statSync(microservicesDir).isDirectory()) {
        reject(`Microservices directory not found: ${microservicesDir}`);
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
 * 
 * @param {Object} options Environment to run the 
 * @param {string} options.microservicesDir The the services root directory
 * @param {string} options.serviceDirectories List of service directories  under [options.microservicesDir] 
 * @param {string} [options.mode] Service environment. Defaults to dev mode
 * @returns {void} Starts services with nodemon in devmode otherwise PM2
 */
const spinVanillaServices = async ({ serviceDirectories, microservicesDir, mode = 'dev' }) => {
    logInfo({ message: `Starting all services in ${mode} mode...` });
    await Promise.all(
        serviceDirectories.map(async (dir) => {
            logInfo({ message: `Starting service concurrently in: ${dir}` });
            await exec(`yarn workspace @microservices-suite${sep}${dir} ${mode}`, { cwd: join(microservicesDir, dir) }, async (error, stdout, stderr) => {
                var error_message = ''
                if (error) {
                    const _ = error.message.split('\n')
                    if (_[1] && _[1].startsWith('error Command') && _[1].endsWith('not found.')) {
                        error_message = `Missing script at ${dir}${sep}package.json: ${_[1].match(/"(.*?)"/)[1]}`
                    }
                    if (_[1] && _[1].startsWith('error There are more than one workspace')) {
                        logError({ error: _[1] && _[1].replace('error ', '') })
                        logAdvise({ message: 'Run suite fix -n to auto-fix all workspace naming issues' })
                        exit(1)
                    }
                    if (_[1] && _[1].includes('Unknown workspace')) {
                        if (existsSync(`${microservicesDir}${sep}${dir}${sep}package.json`)) {
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
                    logSuccess({ message: `Service in directory ${dir} started successfully` });
                }
            });
        }))
}



/**
 * 
 * @param {Object} options Environment to run the 
 * @param {string} [options.components] App environment. Defaults to dev mode
 * @param {array} apps The apps to run 
 */
const spinApp = ({ app, options }) => {
    if (options.kubectl) {
        startKubectlPods()
    }

    exec(`yarn workspace @microservices-suite${sep}${dir} ${mode}`, { cwd: join(microservicesDir, dir) }, async (error, stdout, stderr) => {
        var error_message = ''
        if (error) {
            const _ = error.message.split('\n')
            if (_[1] && _[1].startsWith('error Command') && _[1].endsWith('not found.')) {
                error_message = `Missing script at ${dir}${sep}package.json: ${_[1].match(/"(.*?)"/)[1]}`
            }
            if (_[1] && _[1].includes('Unknown workspace')) {
                if (existsSync(`${microservicesDir}${sep}${dir}${sep}package.json`)) {
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
* 
* @param {Object} options Environment to run the 
* @param {boolean} [options.kubectl] If true runs the app with kubectl
* @param {boolean} [options.mode] App environment
* @param {string[]} [options.apps If true the assumes components defined are apps 
* @returns {void} Starts all components in the existing workspaces
*/
const startApps = async ({ apps, mode, kubectl }) => {
    const {
        component_root_dir: apps_root_dir,
        components_directories: apps_directories
    } = await getComponentDirecotories({
        components: apps,
        component_type: 'app'
    })
    // case -k (--kubectl)
    if (kubectl) {
        //TODO: spin app with kubectl pods
        spinKubectlPods({ apps, mode })
        // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]
    }
    else {
        // case -v(--vanilla)
        // TODO: run services with nodemon in dev mode otherwise PM2
        runVanillaApps({ apps, mode })
    }

    // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]
    // case -v(--vanilla)
    // TODO: run services with nodemon in dev mode otherwise PM2

}

/**
 * 
 * @param {Object} options  
 * @param {array} options.component
 * @param {string} options.component_type
 * @returns {{component_root_dir: string, components_directories: string[]}} - An object containing the root directory of the components and an array of directories for each component.
 */
const getComponentDirecotories = async ({ components, component_type }) => {
    const currentDir = cwd();
    // Check if 'microservices' directory exists
    const is_component_dir = currentDir.split(sep).includes(`${component_type === 'app' ? 'gateway/apps' : 'microservices'}`);

    // Construct component directory path
    const component_root_dir = is_component_dir ?
        currentDir.split(sep).slice(0, currentDir.split(sep).indexOf(`${component_type === 'app' ? 'gateway/apps' : 'microservices'}`) + 1).join(sep) :
        `${currentDir}${sep}${component_type === 'app' ? 'gateway/apps' : 'microservices'}`;
    logInfo({ message: `cwd: ${component_root_dir}` });

    // Check if the component directory exists
    if (!existsSync(component_root_dir) || !statSync(component_root_dir).isDirectory()) {
        reject(`Microservices directory not found: ${component_root_dir}`);
        return;
    }

    // Get a list of directories in the component directory
    let components_directories
    if (!components.length) {
        components_directories = readdirSync(component_root_dir)
            .filter(item => statSync(join(component_root_dir, item)).isDirectory());
    }
    else {
        components_directories = readdirSync(component_root_dir)
            .filter(item => components.includes(item) && statSync(join(component_root_dir, item)).isDirectory()
            );
        components.forEach(service => {
            const valid_dir = components_directories.includes(service) && statSync(join(component_root_dir, service)).isDirectory()
            if (!valid_dir) {
                logError({ error: `No such service under microservices workspace: ${service}` })
                exit(1)
            }
        });
        // .filter(item => {
        // });
    }
    return { component_root_dir, components_directories }
}

/**
* 
* @param {Object} options Environment to run the 
* @param {boolean} [options.vanilla] If true runs the service nodemon
* @param {boolean} [options.mode] App environment
* @param {string[]} [options.services] If true the assumes components defined are apps 
* @returns {void} Starts all components in the existing workspaces
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
    else {
        // TODO: run services with nodemon in dev mode otherwise PM2
        runDockerizedServices({ microservices, mode, vanilla })
    }
    // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]
}

module.exports = {
    generateDirectoryPath,
    changeDirectory,
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
    pathExists
}