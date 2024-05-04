const { join, sep } = require('node:path')
const { mkdirSync } = require('fs')
const os = require('os')
const { cwd, chdir, exit, platform } = require('node:process')
const { existsSync, statSync, readdirSync, writeFileSync } = require('node:fs');
// TODO: use spawn instead for whatever reasons. Yet to find out
let { exec, spawn } = require('node:child_process');
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

        // TODO: switch to spawnSync
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
            const processes = await exec(`yarn  workspace @microservices-suite${sep}${dir}  ${mode}`, { cwd: join(microservicesDir, dir) }, async (error, stdout, stderr) => {
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
            processes.stdout.pipe(process.stdout);
        }))
}

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
    // console.log({ apps_dir, apps_directories, mode })
    logInfo({ message: `Starting all apps in ${mode} mode...` });
    await Promise.all(
        apps_directories.map(async (dir) => {
            logInfo({ message: `Starting app concurrently in: ${dir}` });
            const dockerIsRunning = await checkDocker()
            if (!dockerIsRunning) {

                await startDocker()
            }
            setTimeout(() => {

            }, 1000)
            // TODO: method 1. Has less control but works fine
            const composeCommand = 'docker';
            const composeFile = mode === 'prod' ? 'docker-compose.yml' : `docker-compose.${mode}.yml`;

            const args = [
                'compose',
                '-f',
                `${apps_dir}${sep}${dir}${sep}${composeFile}`,
                'up',
                ...(build ? ['--build'] : [])
            ];

            const options = {
                cwd: join(apps_dir, dir),
                stdio: 'inherit' // to redirect child's stdout/stderr to process's stdout/stderr
            };

            const processes = spawn(composeCommand, args, options);

            processes.on('exit', (code) => {
                if (code !== 0) {
                    logError({ error: `Docker process exited with code ${code}` });
                }
            });

            // TODO: handle docker errors
            // TODO: Method2 with more control has a child_process.stdout.on(...) errror
            // const composeFile = mode === 'prod' ? 'docker-compose.yml' : `docker-compose.${mode}.yml`;

            // const spawn_child = await spawn('docker-compose', ['-f', `${apps_dir}${sep}${dir}${sep}${composeFile}`, 'up', ...(build ? ['--build'] : [])], options);

            // spawn_child.stdout.on('data', (data) => {
            //     const message = data.toString().trim();
            //     logInfo({ message });
            // });

            // spawn_child.stderr.on('data', (data) => {
            //     const message = data.toString().trim();
            //     logSuccess({ message });
            //     // logError({ error }); // Uncomment this line if you prefer logging errors
            // });
            // spawn_child.stderr.on('error', (data) => {
            //     const error = data.toString().trim();
            //     logError({ error });
            //     // logError({ error }); // Uncomment this line if you prefer logging errors
            // });
            // spawn_child.on('error', (error) => {
            //     logError({ error: 'Failed to start child process.' });
            //     logError({ error });
            //     // logError({ error }); // Uncomment this line if you prefer logging errors
            // });

            // spawn_child.on('exit', (code, signal) => {
            //     if (code !== 0) {
            //         logWarning({ message: `Process exited with code: ${code}, signal: ${signal}` });
            //         // logWarning({ message: `exited with code: ${code} signal: ${signal}` }); // Uncomment this line if you prefer logging warnings
            //     } else {
            //         logInfo({ message: 'Process exited successfully' });
            //     }
            // });
            //TODO: handle docker errors
        }))
}

/**
 * 
 * @param {Object} options Environment to run the 
 * @param {string} [options.components] App environment. Defaults to dev mode
 * @param {array} apps The apps to run 
 */
const spinKubectlPods = ({ apps_dir, apps_directories, mode }) => {
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
const startApps = async ({ apps, options }) => {
    const {
        component_root_dir: apps_dir,
        components_directories: apps_directories
    } = await getComponentDirecotories({
        components: apps,
        component_type: 'app'
    })
    // case -k (--kubectl)
    if (options.kubectl) {
        //TODO: spin app with kubectl pods
        spinKubectlPods({ apps_dir, apps_directories, mode: options.mode })
        // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]
    }
    else {
        // case -v(--vanilla)
        // TODO: run services with nodemon in dev mode otherwise PM2
        runDockerizedApps({ apps_dir, apps_directories, mode: options.mode, build: options.build })
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

    // Construct component directory path
    const component_root_dir = `${currentDir.split(sep).slice(0, currentDir.split(sep).indexOf("node-microservices-suite") + 1).join(sep)}${sep}${component_type === 'app' ? `gateway${sep}apps` : 'microservices'}`
    logInfo({ message: `cwd: ${component_root_dir}` });

    // Check if the component directory exists
    if (!existsSync(component_root_dir) || !statSync(component_root_dir).isDirectory()) {
        logWarning({ message: `This does not seem to be a suite monorepo project` });
        logWarning({ message: 'If it is kindly open an issue here: https://github.com/microservices-suite/node-microservices-suite/issues' })
        exit(1);
    }

    // Check if the component directory exists
    if (!existsSync(component_root_dir) || !statSync(component_root_dir).isDirectory()) {
        logError({ error: `This does not seem to be a suite monorepo project` });
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

    // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]
}
const repoReset = ({ components, options }) => {
    spawn('yarn', ['repo:reset'], { stdio: 'inherit' })
}

const stopApps = async ({ components, options }) => {
    const {
        component_root_dir: apps_dir,
    } = await getComponentDirecotories({
        components,
        component_type: 'app'
    })
    // TODO: handle case where no app is specified. component.length === 0 and if -k or --kill command is passed
    spawn('docker', ['compose', '-f', `${apps_dir}${sep}${components}${sep}docker-compose.dev.yml`, 'down'], { stdio: 'inherit' })
}

/**
 * prunes docker artifacts.See docker system prune --help
 * @param {Object} options If true does not prompt for confirmation  
 * @returns void
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
const addPackageJson = ({ projectPath, answers }) => {
    // Add a package.json
    const packageJson = {
        name: `${answers.project_base}${sep}${answers.repo_name}`,
        version: "1.0.0",
        description: "This is a microservices project",
        main: "index.js",
        scripts: {
            "test": "jest",
            "dev": "NODE_ENV=dev nodemon -q index.js",
            "start": "pm2-runtime start ecosystem.config.js --env production",
            "stop:prod": "pm2 stop ecosystem.config.js",
            "delete:prod": "pm2 delete ecosystem.config.js"
        },
        "author": os.userInfo().username,
        "license": answers.license,
        "private": answers.private,
        "scripts": {
            "repo:reset": `find ..${sep}${answers.repo_name} -type d -name 'node_modules' -exec rm -rf {} + && find ..${sep}${answers.repo_name} -type f -name 'package-lock.json' -delete && find ..${sep}${answers.repo_name} -type f -name 'yarn.lock' -delete && find ..${sep}${answers.repo_name} -type d -name 'yarn-*' -exec rm -rf {} +`,
            "repo:reset:1": "rm -rf node_modules",
            "generate:release": "npx changelogen@latest --release",
            "release:config": `yarn workspace ${answers.project_base}/config run release`,
            "release:errors": `yarn workspace ${answers.project_base}/errors run release`,
            "release:middlewares": `yarn workspace ${answers.project_base}/middlewares run release`,
            "release:utilities": `yarn workspace ${answers.project_base}/utilities run release`,
            "test": "jest"
        },
        "workspaces": {
            "packages": [
                `microservices${sep}*`,
                `shared${sep}*`,
            ],
            "nohoist": [
                `**${sep}${answers.project_base}${sep}utilities`,
                `**${sep}${answers.project_base}${sep}errors`,
                `**${sep}${answers.project_base}${sep}config`,
                `**${sep}${answers.project_base}${sep}middleware`
            ]
        },
    };

    writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

    const dependencies = [
        `${answers.project_base}/config@1.0.0`,
        `${answers.project_base}/errors@1.0.0`,
        `${answers.project_base}/utilities@1.0.0`,
        `${answers.project_base}/middlewares@1.0.0`,
        "dotenv",
        "express",
        "helmet",
        "morgan",
        "pm2",
        "winston",
        "mongoose"
    ];
    const devDependencies = ["nodemon"];
    const configDependencies = ['dotenv', 'joi', 'morgan', 'winston']
    const utilitiesDependencies = ['joi']
    // Join dependencies into a single string for the command
    const depsCommand = dependencies.join(' ');
    const devDepsCommand = devDependencies.join(' ');

    // Build the command
    const command = `yarn workspace ${answers.project_base}${sep}microservice1 add ${depsCommand} && yarn workspace ${answers.project_base}${sep}microservice1 add -D ${devDepsCommand}&& yarn workspace ${answers.project_base}${sep}utilities add ${utilitiesDependencies}&& yarn workspace ${answers.project_base}${sep}config add ${configDependencies.join(' ')}`;
    
    // Execute the command
    const childProcess = spawn(command, {
        cwd: projectPath,
        shell: true
    });

    // Log output
    childProcess.stdout.on('data', data => {
        logInfo({ message: `${data}` });
    });

    childProcess.stderr.on('data', data => {
        logWarning({ message: `${data}` });
    });

    // Handle errors
    childProcess.on('error', error => {
        logError({ error: `Error executing command: ${error.message}` });
    });

    // Handle process exit
    childProcess.on('exit', (code, signal) => {
        if (code !== 0) {
            logError({ error: `Command exited with code ${code} and signal ${signal}` });
            return;
        }
        logSuccess({ message: 'Dependencies installed' });
        logSuccess({ message: `To start the project, run 'cd ${answers.repo_name} && yarn dev'` });
    });
}
const addMicroservice = ({ projectPath, answers }) => {

    // TODO: move this to a separate assets folder and readfileSync
    const serverContent = `
    const http = require('http');
    const express = require('express');
    const mongoose = require('mongoose');
    const { config, morgan, logger } = require('${answers.project_base}${sep}config');
    const { errorHandler } = require('${answers.project_base}${sep}errors');
    const { validate, APIError } = require('${answers.project_base}${sep}utilities');
    const { getUsers } = require('./src/services');
    const { router } = require('./src/routes');
    // const app = require('./src/app');

    mongoose.connect(config.db).then(() => {
    logger.info(\`successfully connected to db: \${config.db}\`);
    }).catch(err => {
    logger.error(\`failed to connect to db.exiting...\${err.message}\`);
    process.exit(0);
    });

    const app = express();

    app.use(express.json());

    app.get('/', (req, res) => {
    res.json({ messae: 'hello from ${answers.project_base}' });
    });

    const server = http.createServer(app);

    server.on('error', (err) => {
    logger.error(err);
    if (err.code === 'EADDRINUSE') {
        logger.error('Address already in use, retrying...');
        setTimeout(() => {
        server.close();
        server.listen(config.port, 'localhost');
        }, 1000);
        errorHandler(err);
    }
    })

    server.listen(config.port, () => {
        logger.info(\`${answers.project_base} service connected 🚀 here: http://localhost:\${config.port}\`);
    });

    app.use(morgan.errorHandler);

    app.use(morgan.successHandler);

    app.use('/api/v1', router);

    // global error handler should come after all other middlewares
    app.all('*', (req, res, next) => {
    const err = new APIError(404, \`requested resource not found on server: \${req.originalUrl}\`);
    next(err);
    });

    app.use(errorHandler);
    `;
    const testContent = '//TODO: write your tests here'
    // const modelContent = `
    // const mongoose = require('mongoose')
    // const ObjectId = require('mongodb')

    // const service1Schema = new mongoose.Schema(
    //     {
    //     name:{
    //         type: String,
    //         require: true
    //     },
    //     phone:{
    //         type : String,
    //         require : true
    //     },
    //     email : {
    //         type : String,
    //         require : true
    //     },
    //     product_list:{
    //         type : Array
    //     }
    // },
    // {
    //     timestamp : true
    // }
    // )

    // service1Schema.index({ name, phone, email}, { unique : true})
    // module.exports = mongoose.model('service1', service1Schema)
    // `
    // const routesContent = `
    // const express = require('express')
    // const router = express.Router()
    // const {service1Controller} = require('../../controllers')

    // router.route('/')
    //     .get(service1Controller.getService1)

    // module.exports = router
    // `
    // const controllersContent = `
    // const { publishMessage , subscribeMessage} = require('../utlis/index')
    // const {PRODUCT_BINDING_KEY, CUSTOMER_BINDING_KEY, SUPPLIER_BINDING_KEY} = require('../config/index')
    // const { json } = require('express')

    // const getService1 = async(req, res) => {
    //     try {    
    //         // const channel = req.rabbitMQChannel; 
    //         publishMessage(req.rabbitMQChannel, CUSTOMER_BINDING_KEY, JSON.stringify({ "name" : "Supplie"}))   
    //         res.status(200).send({data : ["This is fetch service1"]})
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // module.exports = {
    //     getService1
    // }
    // `
    // Content templates - Define these according to what each file should contain
    const modelContent = 'module.exports = {};'; // Example content for model
    const controllersContent = `
    const services = require('../services')
    const { asyncErrorHandler, APIError } = require('${answers.project_base}/utilities')
    const hello = asyncErrorHandler(async (req, res) => {
        res.status(200).json({ data:'Hello from ${answers.project_base}' })
    })
    module.exports = {
        hello,
    }`;
    const routesContent = 'const express = require(\'express\');\nconst router = express.Router();\nmodule.exports = { router };';
    const servicesContent = 'module.exports = {};';
    const servicesIndexContent = 'module.exports = {};';
    const modelIndexContent = 'const models = require(\'./model\');\nmodule.exports = models;';
    const routesIndexContent = 'const { router } = require(\'./routes\');\nmodule.exports = { router };';
    const controllersIndexContent = 'const { hello } = require(\'./controllers\');\nmodule.exports = controllers;';
    const configConfigContent = `
    const dotenv = require('dotenv');
    const joi = require('joi');
    const path = require('path');

    if (process.env.NODE_ENV === 'prod') dotenv.config({ path: \`\${path.resolve('./.env')}\` });
    else {
        dotenv.config({ path: \`\${path.resolve('./.env')}.\${process.env.NODE_ENV}\` })
    }
    const envVarsSchema = joi.object().keys({
        PORT: joi.number().required(),
        DATABASE_URL: joi.string().uri().required()
    }).unknown();


    const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
    if (error) {
        throw new Error(\`Config validation error: \${error.message}\`);
    }


    module.exports = {
        db: envVars.DATABASE_URL,
        port: envVars.PORT,
        env: process.env.NODE_ENV

    }
`;
    const configIndexContent = `
    module.exports.config = require('./config')
    module.exports.logger = require('./logger')
    module.exports.morgan = require('./morgan')
`;

    const configLoggerContent = `
    const winston = require('winston');
    const config = require('./config');

    // Logger configurations
    const enumerateErrorFormat = winston.format((info) => {
        if (info instanceof Error) {
            Object.assign(info, { message: info.stack });
        }
        return info;
    });

    const logger = winston.createLogger({
        level: config.env === 'dev' ? 'debug' : 'info',
        format: winston.format.combine(
            enumerateErrorFormat(),
            config.env === 'dev' ? winston.format.colorize() : winston.format.uncolorize(),
            winston.format.splat(),
            winston.format.printf(({ level, message }) => \`\${level}: \${message}\`)
        ),
        transports: [
            new winston.transports.Console({
                stderrLevels: ['error'],
            }),
        ],
    });

    module.exports = logger
`;
    const configMorganContent = `
    const morgan = require('morgan');
    const config = require('./config');
    const logger = require('./logger');

    morgan.token('message', (req, res) => res.locals.errorMessage || '');

    const getIpFormat = () => (config.env === 'prod' ? ':remote-addr - ' : '');
    const successResponseFormat = \`\${getIpFormat()}:method :url :status - :response-time ms\`;
    const errorResponseFormat = \`\${getIpFormat()}:method :url :status - :response-time ms - message: :message\`;

    const successHandler = morgan(successResponseFormat, {
        skip: (req, res) => res.statusCode >= 400,
        stream: {
            write: (message) => {
                if (config.env === 'dev') {
                    logger.info(message.trim());
                }
            }
        },
    });

    const errorHandler = morgan(errorResponseFormat, {
        skip: (req, res) => res.statusCode < 400,
        stream: { write: (message) => logger.error(message.trim()) },
    });

    module.exports = {
        successHandler,
        errorHandler,
    };
    `;
    const genericPackageJsonContent = ({ suffix, isMicroservice, description }) => (
        {
            name: `${answers.project_base}/${suffix}`,
            version: "1.0.0",
            description,
            main: "index.js",
            author: `${os.userInfo().username}`,
            license: `${answers.license}`,
            publishConfig: {
                access: "public",
                registry: "http://registry.npmjs.org"
            },
            scripts: {
                release: "npx bumpp-version@latest && npm publish",
                ...(isMicroservice ? {
                    dev: "NODE_ENV=dev nodemon -q index.js",
                    start: "pm2-runtime start ecosystem.config.js --env production",
                    stoprod: "pm2 stop ecosystem.config.js",
                    deletprod: "pm2 delete ecosystem.config.js",
                    test: "jest",
                } : {}
                )
            },
            private: false,
        })
        ;
    const configReadmeContent = `
    # ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)}

    ## Configuration Package

    Welcome to the ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)} Configuration Package! This package, part of our monorepo, offers a centralized solution for managing configuration settings across your microservices applications. By consolidating configuration options, you ensure consistency and ease of maintenance throughout your codebase.
    `;
    const errorHandlerContent = `
    const config = require("../config/config");
    const { APIError } = require("../utilities");

    const prodErrors = (err, res) => {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Something wrong happened! Try again later'
            });
        }
    }
    const devErrors = (err, res) => {
        res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            stack: err.stack,
            err
        });
    }
    const castErrorHandler = (err) => {
        err.message = \`Invalid value \${err.value} for field \${err.path}\`
        return new APIError(400, err.message)
    }
    const duplicateKeyErrorHandler = (err) => {
        const key = Object.keys(err.keyValue)[0]
        const value = err.keyValue[key]
        const message = \`Entry with \${key}:\${value} already exists\`
        return new APIError(400, message)
    }
    const errorHandler = (err, req, res, next) => {
        // TODO: create the global error handler
        err.message = err.message || 'Internal Server Error';
        err.statusCode = err.statusCode || 500;
        if (config.env === 'dev') {
            devErrors(err, res);
        }
        else {
            let error = { ...err, message: err.message }
            if (err.name === 'CastError') {
                error = castErrorHandler(error)
            }
            if (err.code === 11000) {
                error = duplicateKeyErrorHandler(error)
            }
            prodErrors(error, res)
        }
    }

    module.exports = errorHandler;
    `;
    const errorReadmeContent = `
    # ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)}

    ## Error handler package
    
    Welcome to the ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)} Error Handler Package! This package, residing within our monorepo, provides robust error handling capabilities tailored for microservices architecture. It equips you with the tools to effectively manage and respond to errors across your microservices applications, ensuring reliability and resilience.
`;
    const errorIndexContent = `
    module.exports.errorHandler = require('./errors.handler')
`;
    const ApiErrorContent = `
    class APIError extends Error {
        constructor(statusCode, message) {
            super(message);
            this.statusCode = statusCode;
            this.status = statusCode >= 400 && statusCode <= 500 ? 'fail' : 'error';

            // use this to optionally to send error message to client
            this.isOperational = true

            // preserve stack trace from base class
            Error.captureStackTrace(this, this.constructor)
        }
    }

    module.exports = APIError
`;
    const utilitiesIndexContent = `
    module.exports.APIError = require('./APIError')
    module.exports.asyncErrorHandler = require('./asyncErrorHandler')
    module.exports.pick = require('./pick')
    module.exports.validate = require('./validate')
`;
    const utilitiesPickContent = `
    const pick = (object, keys) => {
        const validSchema = keys.reduce((obj, key) => {
        if (object && object.hasOwnProperty(key)) {
            obj[key] = object[key];
        }
        return obj;
        }, {});
        return validSchema;
    };
    
    module.exports = pick
  `;
    const utilitiesValidateContent = `
  const Joi = require('joi')
const pick = require('./pick')
const { APIError } = require('.')

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'body', 'query'])
    const filterdRequest = pick(req, Object.keys(validSchema))
    const { error, warning, value } = Joi.compile(validSchema).preferences({ abortEarly: false, convert: true, allowUnknown: true }).validate(filterdRequest)
    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        next(new APIError(400, errorMessage));
    }
    next()
}

module.exports = validate
`;
    const utilitiesReadmeContent = `
    # ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)}

    ## Utilities

    Welcome to the ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)} Utilities Package! This package is a part of the larger monorepo dedicated to housing reusable utility functions tailored for microservices architecture. Within this package, you'll find a collection of utility functions designed to streamline various aspects of microservices development.

  `;
    const unitilitiesAsyncErrorHandlerContent = `
    const asyncErrorHandler = (fn) => (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch((err) => {
            next(err)
        })
    }

    module.exports = asyncErrorHandler
    `;
    const middlewaresReadmeContent = `
    # ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)}

    ## Middlewares Package

    Welcome to the ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)} Middlewares Package! This package, residing within our monorepo, provides a collection of middleware functions tailored for microservices architecture. These middleware functions enable you to enhance and extend the functionality of your microservices applications with ease.
    `;
    const middlewaresIndexContent = `
    module.exports.middleware1 = (req,res,next)=>{
    next()
    }
    `;
    const e2eTestContent = `
const puppeteer = require('puppeteer');

describe('End-to-End Tests', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Example E2E Test', async () => {
        await page.goto('https://${answers.project_base}.com');
        // Write your test logic here
    });
});
`;
    const unitTestContent = `
describe('Unit Tests', () => {
    test('Example Unit Test', () => {
        // Write your unit test logic here
    });

    // Add more unit tests as needed
});
`;
    const integrationTestContent = `
describe('Integration Tests', () => {
    test('Example Integration Test', async () => {
        // Write your integration test logic here
    });

    // Add more integration tests as needed
});
`;
    const snapshotTestContent = `
import React from 'react';
import renderer from 'react-test-renderer';
import MyComponent from './MyComponent';

describe('Snapshot Tests', () => {
    test('MyComponent snapshot', () => {
        const component = renderer.create(<MyComponent />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    // Add more snapshot tests as needed
});
`;
    const k8sReadmeContent = `
# ${answers.project_base.charAt(0).toUpperCase() + answers.project_base.slice(1)}
## kubernetes orchestration package

All services workflow orchestration live here. Write scalable workflows and orchestrate using the \`declarative\` approach. To use \`imperative\` approach you can issue direct \`kubectl\` commands to your \`pod clusters\` e.g during development. 
`;
    const k8sClientNodeContent = `
apiVersion: v1
kind: Service
metadata:
  name: supplier-service-port
spec:
  type: NodePort
  ports:
    - port: 8008
      targetPort: 9008
      NodePort: 31008
  selector:
    app: ecommerce-app
`;
    const k8sClientPodContent = `
apiVersion: v1
kind: Pod
metadata:
  name: supplier-service-pod
  labels:
    component: supplier
spec:
  containers:
    - name: supplier-service
      image: gandie/ecommerce-supplier-service
      resources:
        limits:
          memory: "128Mi"
          cpu: "500m"
      ports:
        - containerPort: 9001
`;
    const k8sClusterIpServiceContent = `
#TODO: to add cluster IP service here
`;
    const k8sIngressServiceContent = `
#TODO: to add Ingress service here
`;
    const k8sClusterDeploymentContent = `
#TODO: to add Deployment logic here
`;
    const apolloServerContent = `
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

const typeDefs = gql\`
  type Query {
    hello: String
  }
\`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(\`🚀 Server ready at http://localhost:4000\${server.graphqlPath}\`)
);
`;
    const envContent = `
PORT=9001
DATABASE_URL=mongodb://localhost:27017
`;
    const ecosystemContent = `
apps : [{
    name   : "upload_service",
    autorestart: true,
    watch: true,
    time: true,
    script : "./index.js",
    instances:4,
    env_production: {
      NODE_ENV: "prod",
      DATABASE_URL:"mongodb://localhost:27017",
      PORT:9001
   },
   env_development: {
    NODE_ENV: "dev",
    DATABASE_URL:"mongodb://localhost:27017",
    PORT:9001
 }
  }]
}
`;
    [
        `shared${sep}config`,
        `shared${sep}errors`,
        `shared${sep}utilities`,
        `shared${sep}middlewares`,
        `tests${sep}microservice1${sep}e2e`,
        `tests${sep}microservice1${sep}integration`,
        `tests${sep}microservice1${sep}unit`,
        `tests${sep}microservice1${sep}snapshot`,
        `microservices`,
        `k8s${sep}microservice1`,
        `gateways${sep}apps${sep}app1${sep}${answers.webserver}`,
        ...(answers.apis.map((api) => `${api}${sep}app1`)),
    ].forEach((dir) => {
        const current_dir = `${projectPath}${sep}${dir}`
        mkdirSync(current_dir, { recursive: true });
        switch (dir) {
            case `shared${sep}config`:
                writeFileSync(join(current_dir, 'config.js'), configConfigContent);
                writeFileSync(join(current_dir, 'index.js'), configIndexContent);
                writeFileSync(join(current_dir, 'logger.js'), configLoggerContent);
                writeFileSync(join(current_dir, 'morgan.js'), configMorganContent);
                writeFileSync(join(current_dir, 'package.json'), JSON.stringify(genericPackageJsonContent({
                    suffix: 'config',
                    isMicroservice: false,
                    description: "This contains common configurations for things like env files,loggers etc for easy setup of environment specific settings"
                }), null, 2));
                writeFileSync(join(current_dir, 'README.md'), configReadmeContent);
                break;
            case `shared${sep}errors`:
                writeFileSync(join(current_dir, 'errors.handler.js'), errorHandlerContent);
                writeFileSync(join(current_dir, 'index.js'), errorIndexContent);
                writeFileSync(join(current_dir, 'package.json'), JSON.stringify(genericPackageJsonContent({
                    suffix: 'errors',
                    isMicroservice: false,
                    description: "This is the global error handler for handling error messages in development and production environments"
                }), null, 2));
                writeFileSync(join(current_dir, 'README.md'), errorReadmeContent);
                break;
            case `shared${sep}utilities`:
                writeFileSync(join(current_dir, 'APIError.js'), ApiErrorContent);
                writeFileSync(join(current_dir, 'index.js'), utilitiesIndexContent);
                writeFileSync(join(current_dir, 'package.json'), JSON.stringify(genericPackageJsonContent({
                    suffix: 'utilities',
                    isMicroservice: false,
                    description: ""
                }), null, 2));
                writeFileSync(join(current_dir, 'README.md'), utilitiesReadmeContent);
                writeFileSync(join(current_dir, 'pick.js'), utilitiesPickContent);
                writeFileSync(join(current_dir, 'validate.js'), utilitiesValidateContent);
                writeFileSync(join(current_dir, 'asyncErrorHandler.js'), unitilitiesAsyncErrorHandlerContent);
                break;
            case `shared${sep}middlewares`:
                writeFileSync(join(current_dir, 'index.js'), middlewaresIndexContent);
                writeFileSync(join(current_dir, 'package.json'), JSON.stringify(genericPackageJsonContent({
                    suffix: 'middlewares',
                    isMicroservice: false,
                    description: ""
                }), null, 2));
                writeFileSync(join(current_dir, 'README.md'), middlewaresReadmeContent);
                break;
            case `tests${sep}microservice1${sep}e2e`:
                writeFileSync(join(current_dir, 'test1.js'), e2eTestContent);
                break;
            case `tests${sep}microservice1${sep}integration`:
                writeFileSync(join(current_dir, 'test1.js'), integrationTestContent);
                break;
            case `tests${sep}microservice1${sep}unit`:
                writeFileSync(join(current_dir, 'test1.js'), unitTestContent);
                break;
            case `tests${sep}microservice1${sep}snapshot`:
                writeFileSync(join(current_dir, 'test1.js'), snapshotTestContent);
                break;
            case `graphql${sep}app1`:
                writeFileSync(join(current_dir, 'appollo-server.js'), apolloServerContent);
                break;
            case `k8s${sep}microservice1`:
                writeFileSync(join(current_dir, 'client-node-port.yaml'), k8sClientNodeContent);
                writeFileSync(join(current_dir, 'client-pod.yaml'), k8sClientPodContent);
                writeFileSync(join(current_dir, 'cluster-deployment.yml'), k8sClusterDeploymentContent);
                writeFileSync(join(current_dir, 'README.md'), k8sReadmeContent);
                writeFileSync(join(current_dir, 'cluster-ip-service.yml'), k8sClusterIpServiceContent);
                writeFileSync(join(current_dir, 'ingress-service.yml'), k8sIngressServiceContent);
        }
    });
    ['models', 'controllers', 'routes', 'services'].forEach(mcs => {
        // Correct the file extension based on directory
        const mcsPath = `${projectPath}${sep}microservices${sep}microservice1${sep}src${sep}${mcs}`
        mkdirSync(mcsPath, { recursive: true })
        const fileExtension = mcs === 'models' ? 'model.js' : mcs === 'routes' ? 'routes.js' : 'controllers.js';

        // Write main file content
        const mainContent = mcs === 'models' ? modelContent : mcs === 'routes' ? routesContent : mcs === 'controllers'?controllersContent:servicesContent;
        writeFileSync(join(mcsPath, `${fileExtension}`), mainContent);

        // Write index file content
        const indexContent = mcs === 'models' ? modelIndexContent : mcs === 'routes' ? routesIndexContent : mcs === 'controllers' ? controllersIndexContent : servicesIndexContent;
        writeFileSync(join(mcsPath, 'index.js'), indexContent);
    });
    writeFileSync(join(`${projectPath}${sep}microservices${sep}microservice1`, 'index.js'), serverContent);
    writeFileSync(join(`${projectPath}${sep}microservices${sep}microservice1`, '.env'), envContent);
    writeFileSync(join(`${projectPath}${sep}microservices${sep}microservice1`, '.env.dev'), envContent);
    writeFileSync(join(`${projectPath}${sep}microservices${sep}microservice1`, 'ecosystem.config.js'), ecosystemContent);
    writeFileSync(join(`${projectPath}${sep}microservices${sep}microservice1`, 'package.json'), JSON.stringify(genericPackageJsonContent({
        suffix: 'microservice1',
        isMicroservice: true,
        description: "This is a sample server that returns Hello at localhost:3000"
    }), null, 2));

    logSuccess({ message: `Project ${answers.repo_name} created successfully!` });
    logSuccess({ message: 'Installing dependencies...' });
}
const scaffoldNewRepo = async ({ answers }) => {
    const projectPath = join(cwd(), answers.repo_name);
    const gateway_dir = `${projectPath}${sep}microservice1`
    mkdirSync(projectPath, { recursive: true });
    addMicroservice({ projectPath, answers })
    addPackageJson({ projectPath, answers: { ...answers, private: true } })
}

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
    scaffoldNewRepo
}