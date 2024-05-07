const chalk = require('chalk')
const { join, sep } = require('node:path')
const os = require('os')
const { mkdirSync, readFile } = require('fs')
const { cwd, chdir, exit, platform } = require('node:process')
const { existsSync, statSync, readdirSync, writeFileSync, readFileSync } = require('node:fs');
let { exec, spawn } = require('node:child_process');
const { writeFile } = require('node:fs/promises');
const assets = require('./assets')

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
    }
    else {
        runDockerizedApps({ apps_dir, apps_directories, mode: options.mode, build: options.build })
    }

    // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]

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
 * @param {Object} options  
 * @param {boolean} options.volume If true this command targets docker volumes otherwise system  
 * @param {boolean} options.all If true this command prunes system & volume artifacts  
 * @param {boolean} options.force If true does not prompt for confirmation  
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

/**
 * Adds initial minimal dependencies and installs at microservice workspace and shared workspace
 * @param {Object} options 
 * @param {Object} options.answers 
 * @param {string} options.answers.project_base 
 * @param {string} options.answers.repo_name 
 * @param {string} options.project_path
 * @returns void
 */
const addPackageJson = ({ project_path, answers }) => {
    // Add a package.json 
    writeFileSync(join(project_path, 'package.json'), JSON.stringify(assets.rootPackageJsonContent({ answers, os, sep }), null, 2));
    writeFileSync(join(project_path, 'package.json'), JSON.stringify(assets.rootPackageJsonContent({ answers, os, sep }), null, 2));

    const dependencies = [
        `${answers.project_base}/config@1.0.0`,
        `${answers.project_base}/errors@1.0.0`,
        `${answers.project_base}/utilities@1.0.0`,
        `${answers.project_base}/middlewares@1.0.0`,
        "dotenv",
        "express",
        "helmet",
        "morgan",
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
    const command = `yarn workspace ${answers.project_base}${sep}${answers.service_name} add ${depsCommand} && yarn workspace ${answers.project_base}${sep}${answers.service_name} add -D ${devDepsCommand}&& yarn workspace ${answers.project_base}${sep}utilities add ${utilitiesDependencies}&& yarn workspace ${answers.project_base}${sep}config add ${configDependencies.join(' ')}`;
    // TODO: find a way to use spawn instead
    exec(`cd ${answers.repo_name} && git init`)
    // Execute the command
    const childProcess = spawn(command, {
        cwd: project_path,
        shell: true,
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

/**
 * Scaffolds a new project generating suite standard file structure with initial boiler plate
 * @param {Object} options 
 * @param {Object} options.answers 
 * @param {string} options.answers.webserver 
 * @param {string} options.answers.apis 
 * @param {string} options.answers.license 
 * @param {string} options.answers.project_base 
 * @param {string} options.answers.repo_name 
 * @returns void
 */
const addMicroservice = ({ project_path, answers }) => {
    const directories = assets.fileStructureContent({ sep, answers })
    directories.forEach((dir) => {
        const current_dir = `${project_path}${sep}${dir}`
        if (dir !== `REST${sep}app1`) mkdirSync(current_dir, { recursive: true });
        switch (dir) {
            case `shared${sep}config`:
                writeFile(join(current_dir, 'config.js'), assets.configConfigContent());
                writeFile(join(current_dir, 'index.js'), assets.configIndexContent());
                writeFile(join(current_dir, 'logger.js'), assets.configLoggerContent());
                writeFile(join(current_dir, 'morgan.js'), assets.configMorganContent());
                writeFile(join(current_dir, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
                    answers,
                    suffix: 'config',
                    isMicroservice: false,
                    os,
                    description: "This contains common configurations for things like env files,loggers etc for easy setup of environment specific settings"
                }), null, 2));
                writeFile(join(current_dir, 'README.md'), assets.configReadmeContent({ answers }));
                break;
            case `shared${sep}errors`:
                writeFile(join(current_dir, 'errors.handler.js'), assets.errorHandlerContent());
                writeFile(join(current_dir, 'index.js'), assets.errorIndexContent());
                writeFile(join(current_dir, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
                    answers,
                    suffix: 'errors',
                    isMicroservice: false,
                    os,
                    description: "This is the global error handler for handling error messages in development and production environments"
                }), null, 2));
                writeFile(join(current_dir, 'README.md'), assets.errorReadmeContent({ answers }));
                break;
            case `shared${sep}utilities`:
                writeFile(join(current_dir, 'APIError.js'), assets.apiErrorContent());
                writeFile(join(current_dir, 'index.js'), assets.utilitiesIndexContent());
                writeFile(join(current_dir, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
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
            case `shared${sep}middlewares`:
                writeFile(join(current_dir, 'index.js'), assets.middlewaresIndexContent());
                writeFile(join(current_dir, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
                    answers,
                    suffix: 'middlewares',
                    isMicroservice: false,
                    os,
                    description: ""
                }), null, 2));
                writeFile(join(current_dir, 'README.md'), assets.middlewaresReadmeContent({ answers }));
                break;
            case `tests${sep}${answers.service_name}${sep}e2e`:
                writeFile(join(current_dir, 'test1.js'), assets.e2eTestContent({ answers }));
                break;
            case `tests${sep}${answers.service_name}${sep}integration`:
                writeFile(join(current_dir, 'test1.js'), assets.integrationTestContent());
                break;
            case `tests${sep}${answers.service_name}${sep}unit`:
                writeFile(join(current_dir, 'test1.js'), assets.unitTestContent());
                break;
            case `tests${sep}${answers.service_name}${sep}snapshot`:
                writeFile(join(current_dir, 'test1.js'), assets.snapshotTestContent());
                break;
            case `GraphQL${sep}app1`:
                writeFile(join(current_dir, 'appollo-server.js'), assets.apolloServerContent());
                break;
            case `k8s${sep}${answers.service_name}`:
                // TODO: move k8s into a function
                writeFile(join(current_dir, 'client-node-port.yaml'), assets.k8sClientNodeContent());
                writeFile(join(current_dir, 'client-pod.yaml'), assets.k8sClientPodContent());
                writeFile(join(current_dir, 'cluster-deployment.yml'), assets.k8sClusterDeploymentContent());
                writeFile(join(current_dir, 'README.md'), assets.k8sReadmeContent({ answers }));
                writeFile(join(current_dir, 'cluster-ip-service.yml'), assets.k8sClusterIpServiceContent());
                writeFile(join(current_dir, 'ingress-service.yml'), assets.k8sIngressServiceContent());
                break;
        }
    });

    generateMCSHelper({ project_path, answers })
    writeFile(join(`${project_path}${sep}microservices${sep}${answers.service_name}`, 'index.js'), assets.serverContent({ answers, sep }));
    writeFile(join(`${project_path}${sep}microservices${sep}${answers.service_name}`, '.env'), assets.envContent());
    writeFile(join(`${project_path}${sep}microservices${sep}${answers.service_name}`, '.env.dev'), assets.envContent());
    writeFile(join(`${project_path}${sep}microservices${sep}${answers.service_name}`, 'ecosystem.config.js'), assets.ecosystemContent());
    mkdirSync(join(project_path, '.vscode'), { recursive: true })
    writeFileSync(join(project_path, '.gitignore'), assets.gitignoreContent());
    writeFileSync(join(project_path, '.vscode', 'launch.json'), JSON.stringify(assets.debuggerConfigContent(), null, 2));
    writeFileSync(join(project_path, '.gitignore'), assets.gitignoreContent());
    mkdirSync(join(project_path, '.vscode'), { recursive: true })
    writeFileSync(join(project_path, '.vscode', 'launch.json'), JSON.stringify(assets.debuggerConfigContent(), null, 2));
    writeFile(join(`${project_path}${sep}microservices${sep}${answers.service_name}`, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
        answers,
        suffix: `${answers.service_name}`,
        isMicroservice: true,
        os,
        description: "This is a sample server that returns Hello at localhost:3000"
    }), null, 2));

    logSuccess({ message: `Project ${answers.repo_name} created successfully!` });
    logSuccess({ message: 'Installing dependencies...' });
}


/**
 * Scaffolds a new project generating suite standard file structure with initial boiler plate
 * @param {Object} options 
 * @param {Object} options.answers 
 * @param {string} options.answers.service_name
 * @param {boolean} options.answers.private
 * @returns void
 */
const scaffoldNewRepo = async ({ answers }) => {
    const project_path = join(cwd(), answers.repo_name);
    mkdirSync(project_path, { recursive: true });
    addMicroservice({ project_path, answers: { ...answers, service_name: 'microservice1' } })
    addPackageJson({ project_path, answers: { ...answers, private: true, service_name: 'microservice1' } })
}

/**
 * Scaffolds a new service generating suite standard mcs file structure with initial boiler plate
 * @param {Object} options 
 * @param {Object} options.answers additional options
 * @param {string} options.answers.service_name Name of the service to generate
 * @returns void
 */
const scaffoldNewService = async ({ answers }) => {
    const project_path = join(cwd(), 'microservices', answers.service_name);
    const package_json_path = join(cwd(), 'package.json')
    mkdirSync(project_path, { recursive: true });
    const { workspace_name } = retrieveWorkSpaceName({ package_json_path })
    generateMCSHelper({ project_path, answers: { ...answers, project_base: workspace_name } })
    writeFile(join(`${project_path}`, 'package.json'), JSON.stringify(assets.genericPackageJsonContent({
        answers: { ...answers, project_base: workspace_name },
        suffix: `${answers.service_name}`,
        isMicroservice: true,
        os,
        description: "This is a sample server that returns Hello at localhost:3000"
    }), null, 2));
}

/**
 * Generates a service using MCS architecture with initial boiler plate 
 * @param {Object} options 
 * @param {string} options.project_path  Path to root directory or workspace
 * @param {Object} options.answers
 * @param {string} options.answers.project_base The project name usually a part of the root workspace name
 * @returns {void}
 */
const generateMCSHelper = ({ project_path, answers }) => {
    ['models', 'controllers', 'routes', 'services'].forEach(mcs => {
        // Correct the file extension based on directory
        const mcsPath = `${project_path}${sep}microservices${sep}${answers.service_name}${sep}src${sep}${mcs}`
        mkdirSync(mcsPath, { recursive: true })
        const fileExtension = mcs === 'models' ? 'model.js' : mcs === 'routes' ? 'routes.js' : 'controllers.js';

        // Write main file content
        const mainContent = mcs === 'models' ? assets.modelContent() : mcs === 'routes' ? assets.routesContent() : mcs === 'controllers' ? assets.controllersContent({ answers }) : assets.servicesContent();
        writeFileSync(join(mcsPath, `${fileExtension}`), mainContent);

        // Write index file content
        const indexContent = mcs === 'models' ? assets.modelIndexContent() : mcs === 'routes' ? assets.routesIndexContent() : mcs === 'controllers' ? assets.controllersIndexContent() : assets.servicesIndexContent();
        writeFileSync(join(mcsPath, 'index.js'), indexContent);
    });
}

/**
 * makes package releases
 * @param {Object} options 
 * @param {Object} options.package 
 * @returns void
 */
const releasePackage = async ({ package }) => {
    const package_json_path = join(cwd(), 'package.json');

    // Read the package.json file
    const { workspace_name } = retrieveWorkSpaceName({ package_json_path });
    package && logInfo({ message: `Looking for package: ${workspace_name}/${package}` });
    package && spawn('yarn', ['workspace', `${workspace_name}/${package}`, 'release'], {
        stdio: 'inherit'
    })
    !package && spawn('yarn', ['generate:release'], {
        stdio: 'inherit',
        cwd: cwd()
    })
}

/**
 * 
 * @param {Object} options 
 * @param {string} options.package_json_path Path to workspace
 * @returns workspace_name|undefined Returns workspace name or undefined if does not exist
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
    scaffoldNewService
}