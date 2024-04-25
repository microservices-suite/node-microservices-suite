const { join, sep } = require('node:path')
const { cwd, chdir, exit } = require('node:process')
const { cwd, chdir, exit } = require('node:process')
const { existsSync, statSync, readdirSync } = require('node:fs');
const { platform } = require('node:process');
let { exec } = require('node:child_process');
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
 * @param {string} directory_path The path to the file
 * @returns void
 */
const changeDirectory = ({ directory_path }) => {
    chdir(directory_path)
}


/**
 * Checks if the file exists at the given path.
 * @param {string} file_path  The path to the file to check.
 * @returns {boolean} True if the file exists, false otherwise.
 */
const pathExists = ({ file_path }) => {
    return existsSync(file_path)
}
/**
 * Prints success message to screen
 * @param {string} message Message to display to console 
 * @returns {void}
 */
const logSuccess = ({ message }) => console.log(chalk.blue(`✓ ${message}`))

/**
 * Prints error message to screen
 * @param {string} error Error message to display to console 
 * @returns {void}
 */
const logError = ({ error }) => console.log(chalk.red(`⚠️ ${error}`))

/**
 * Prints informational message to screen
 * @param {string} message Info message to display to console 
 * @returns {void}
 */
const logInfo = ({ message }) => console.log(chalk.gray(`✓ ${message}`))


/**
 * Prints warning message to screen
 * @param {string} message Warning message to display to console 
 * @returns {void}
 */
const logWarning = ({ message }) => console.log(chalk.yellow(`✓ ${message}`))

/**
 * Prints warning message to screen
 * @param {string} message Warning message to display to console 
 * @returns {void}
 */
const logAdvise = ({ message }) => console.log(chalk.stderr(`✓ ${message}`))

/**
 * Compares if 2 values match
 * @param {string} a first value 
 * @param {string} b second value 
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

// In actionHandlers.js
async function start(components, options) {
    logInfo({ message: `Starting ${components.length} components...` });
    const useDockerCompose = options.app || (!options.app && !options.kubectl);

    for (const component of components) {
        const [name] = component.split(':');
        const type = options.app ? 'app' : 'service';
        logInfo({ message: `Starting ${type}: ${name}...` });
        if (options.vanilla) {
            logInfo({ message: `Running ${type} ${name} in development mode with Nodemon` });
            // Logic to start the component with Nodemon
        } else if (useDockerCompose) {
            logInfo({ message: `Running ${type} ${name} with Docker Compose` });
            // Logic to start the component with Docker Compose
        } else {
            logInfo({ message: `Running ${type} ${name} with kubectl` });
            logInfo({ message: `Running ${type} ${name} with kubectl` });
            // Logic to start the component with kubectl
        }
    }
}

const startAll = ({ options }) => {
    // console.log({ options })
    // // case -k (--kubectl)
    // if (options.kubectl) {
    //     // -k(--kubectl) flag passed without specifying the app flag (-a,--app). Throw error & exit process
    //     if (!options.app) {
    //         logError({ error: 'kubectl is only used with -a to run apps. run suite help start for more info' })
    //         exit(1)
    //     }
    //     //TODO: spin app with kubectl pods
    //     spinKubectlPods({ app: options.app, mode: options.mode })
    //     // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]
    // }
    // // case -v(--vanilla)
    // // TODO: run services with nodemon in dev mode otherwise PM2
    // runVanillaServices({ services: [], mode: options.mode })

    return new Promise(async (resolve, reject) => {
        logInfo({ message: "Starting all services in development mode..." });
        const currentDir = cwd();

        // Check if 'microservices' directory exists
        const isMicroservicesDir = currentDir.split(sep).includes('microservices');

        // Construct microservices directory path
        const microservicesDir = isMicroservicesDir ?
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
        await Promise.all(
            serviceDirectories.map((dir) => {
                logInfo({ message: `Starting service concurrently in: ${dir}` });
                exec(`yarn workspace @microservices-suite${sep}${dir} dev`, { cwd: join(microservicesDir, dir) }, async (error, stdout, stderr) => {
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
            }))

    })
}
/**
 * 
 * @param {array} apps The apps to run 
 * @param {Object} options Environment to run the 
 * @param {string} [options.mode] App environment. Defaults to dev mode
 */
const spinKubectlPods = ({ app, mode = 'dev' }) => {

}
module.exports = {
    generateDirectoryPath,
    changeDirectory,
    pathExists,
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
    logWarning
}