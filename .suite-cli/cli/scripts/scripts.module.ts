import { join, sep } from "node:path";
import { cwd, chdir, exit, platform } from 'node:process';

import { existsSync, statSync, readdirSync } from 'node:fs';
// TODO: use spawn instead for whatever reasons. Yet to find out
import { exec } from 'node:child_process';
import chalk from 'chalk'
import { logger } from "../utils/logger";

const generateDirectoryPath = ({ workspace_name, workspace_directory = 'microservice' }: { workspace_name: string, workspace_directory: string}) => {
    return join(cwd(), `${workspace_directory}${sep}${workspace_name}`);
}

const changeDirectory = ({ directory_path }: { directory_path: string }) => {
    chdir(directory_path)
}


const pathExists = ({ file_path }: { file_path: string }) => {
    return existsSync(file_path)
}

const logAdvise = ({ message }: { message: string }) => console.log(chalk.stderr(`✓ ${message}`))


const isMatch = ({ a, b }: { a: string, b: string }) => a === b

interface Platform {
    [key: string]: string
}
const getPlatform = () => {
    const PLATFORM: Platform = {
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

const startDocker = (): Promise<string> => {
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

const installDepsAtWorkspace = ({ workspace_name, workspace_directory = 'microservices', packages }: { workspace_name: string, workspace_directory: string, packages: string[]}) => {
    return new Promise((resolve, reject) => {
        let directory_path;
        try {
            directory_path = generateDirectoryPath({ workspace_name, workspace_directory });

            // Platform aware cd
            const command = process.platform === 'win32' ?
                `cd /d "${directory_path}" && yarn --silent install` :
                `cd "${directory_path}" && yarn --silent install`;

            const options = {
                shell: platform === 'win32' ? 'C:\\Program Files\\Git\\bin\\bash.exe' : '/bin/bash'
            };

            exec(command, options, (err, stdout, stderr) => {
                if (err) {
                    const split_stack = err.stack && err.stack.split('\n')[1].split(sep);

                    //@ts-ignore
                    if (split_stack && split_stack[split_stack.length - 1].split([':']).includes('undefined')) { reject('Workspace name not provided!') }
                    else {
                        reject(err.stack && err.stack.split('\n')[1]); // Extracting the first line of the stack trace
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

const addDepsAtWorkspace = ({ workspace_name, workspace_directory = 'microservices', packages } : { workspace_name: string, workspace_directory: string, packages: string[]} ) => {
    return new Promise((resolve, reject) => {
        let directory_path;
        try {
            directory_path = generateDirectoryPath({ workspace_name, workspace_directory });

            // Platform aware cd
            const command = process.platform === 'win32' ?
                `cd /d "${directory_path}" && yarn --silent add ${packages}` :
                `cd "${directory_path}" && yarn --silent add ${packages}`;

            const options = {
                shell: platform === 'win32' ? 'C:\\Program Files\\Git\\bin\\bash.exe' : '/bin/bash'
            };

            exec(command, options, (err, stdout, stderr) => {
                if (err) {
                    const split_stack = err.stack && err.stack.split('\n')[1].split(sep);
                    //@ts-ignore
                    if (split_stack && split_stack[split_stack.length - 1].split([':']).includes('undefined')) { reject('Workspace name not provided!') }
                    const errorMessage = stderr || err.message;
                    const packageNameRegex = /\/([^/:]+):/;
                    const match = packageNameRegex.exec(errorMessage);
                    if (match && match[1]) {
                        reject(`Package not found in registry: ${match[1]}`);

                    } else {
                        reject(err.stack && err.stack.split('\n')[1]); // Extracting the first line of the stack trace
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

const start = async ({ components, options }: { components: string[], options: { app: string, kubectl: string, vanilla: boolean }}) => {
    const type = options.app ? 'app' : 'service';
    logger.info(`Starting ${components.length || 'all'} ${type}${components.length === 1 ? '' : 's'}...`);
    const useDockerCompose = options.app && !options.kubectl;

    for (const component of components) {
        const [name] = component.split(':');
        console.log({ component, options })
        logger.info(`Starting ${type}: ${name}...`);
        if (options.vanilla) {
            logger.error(`-v flag is only used to run services. Apps only run with kubectl or docker compose` );
            // Logic to start the component with Nodemon
        } else if (useDockerCompose) {
            logger.info(`Running ${type} ${name} with Docker Compose`);
            // Logic to start the component with Docker Compose
        } else {
            logger.info(`Running ${type} ${name} with kubectl`);
            logger.info(`Running ${type} ${name} with kubectl`);
            logger.info(`Running ${type} ${name} with kubectl`);
            // Logic to start the component with kubectl
        }
    }
}

const startAll = async ({ options }: { options: { app: string, kubectl: string, mode: string }}) => {
    // case -k (--kubectl)
    if (options?.kubectl) {
        // -k(--kubectl) flag passed without specifying the app flag (-a,--app). Throw error & exit process
        if (!options.app) {
            logger.error('kubectl is only used with -a flag to run apps. run suite help start for more info')
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
    logger.info(`cwd: ${microservicesDir}`);

    // Check if the microservices directory exists
    if (!existsSync(microservicesDir) || !statSync(microservicesDir).isDirectory()) {
        logger.error(`Microservices directory not found: ${microservicesDir}`);
        return;
    }

    // Get a list of directories in the microservices directory
    const serviceDirectories = readdirSync(microservicesDir)
        .filter(item => statSync(join(microservicesDir, item)).isDirectory());

    // Start each service
    if (options.app) {
        let components = [] as string[];
        await spinApps(components, options, microservicesDir, currentDir)
    } else {
        await spinServices({ microservicesDir, serviceDirectories, mode: options.mode })
    }
    // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]
    // case -v(--vanilla)
    // TODO: run services with nodemon in dev mode otherwise PM2
    // runVanillaServices({ services: [], mode: options.mode })

}

const spinVanillaServices = async ({ serviceDirectories, microservicesDir, mode = 'dev' }: { serviceDirectories: string[], microservicesDir: string, mode: string }) => {
    logger.info(`Starting all services in ${mode} mode...`);
    await Promise.all(
        serviceDirectories.map(async (dir) => {
            logger.info(`Starting service concurrently in: ${dir}`);
            const processes = await exec(`yarn  workspace @microservices-suite${sep}${dir}  ${mode}`, { cwd: join(microservicesDir, dir) }, async (error, stdout, stderr) => {
                var error_message = ''
                if (error) {
                    const _ = error.message.split('\n')
                    if (_[1] && _[1].startsWith('error Command') && _[1].endsWith('not found.')) {
                        //@ts-ignore
                        error_message = `Missing script at ${dir}${sep}package.json: ${_[1].match(/"(.*?)"/)[1]}`
                    }
                    if (_[1] && _[1].startsWith('error There are more than one workspace')) {
                        logger.error( _[1] && _[1].replace('error ', ''))
                        logAdvise({ message: 'Run suite fix -n to auto-fix all workspace naming issues' })
                        exit(1)
                    }
                    if (_[1] && _[1].includes('Unknown workspace')) {
                        if (existsSync(`${microservicesDir}${sep}${dir}${sep}package.json`)) {
                            logger.warning('Wrong workspace naming')
                            logAdvise({ message: 'Run suite fix -n to auto-fix all workspace naming issues' })
                            logAdvise({ message: 'suite fix only changes the package.json. If any service depends on it you will need to update it manually' })
                        } else {
                            logger.error(`Missing package.json @microservices-suite${sep}${dir}`)
                        }
                        exit(1)
                    }
                    logger.error( error_message)
                } else {
                    logger.success(`Service in directory ${dir} started successfully`);
                }
            });
            processes.stdout && processes.stdout.pipe(process.stdout);
        }))
}

const spinApps = (components: string[], options: { app: string, kubectl: string,  mode: string }, microservicesDir: string, currentDir: string  ) => {
    if (options.kubectl) {
        startKubectlPods()
    }

    exec(`yarn workspace @microservices-suite${sep}${currentDir} ${options.mode}`, { cwd: join(microservicesDir, currentDir) }, async (error, stdout, stderr) => {
        var error_message = ''
        if (error) {
            const _ = error.message.split('\n')
            if (_[1] && _[1].startsWith('error Command') && _[1].endsWith('not found.')) {
                error_message = `Missing script at ${currentDir}${sep}package.json: ${_[1].match(/"(.*?)"/)[1]}`
            }
            if (_[1] && _[1].includes('Unknown workspace')) {
                if (existsSync(`${microservicesDir}${sep}${currentDir}${sep}package.json`)) {
                    logger.warning('Wrong workspace naming')
                    logAdvise({ message: 'Run suite fix -n to auto-fix all workspace naming issues' })
                    logAdvise({ message: 'suite fix only changes the package.json. If any service depends on it you will need to update it manually' })
                } else {

                    logger.error(`Missing package.json @microservices-suite${sep}${currentDir}`)
                }
                exit(1)
            }
            logger.error(error_message)
        } else {
            logger.success(`Service in directory ${currentDir} started successfully`);
        }
    });
}

const startApps = async ({ apps, mode, kubectl }: { apps: string[], mode: string, kubectl: string }) => {
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

const getComponentDirecotories = async ({ components, component_type }: { components: string[], component_type: string }): Promise<{ component_root_dir: string, components_directories: string[] }> => {
    const currentDir = cwd();
    
    // Construct component directory path
    const component_root_dir = `${currentDir.split(sep).slice(0, currentDir.split(sep).indexOf("node-microservices-suite") + 1).join(sep)}${sep}${component_type === 'app' ? `gateway${sep}apps` : 'microservices'}`
    logger.info(`cwd: ${component_root_dir}`);

    // Check if the component directory exists
    if (!existsSync(component_root_dir) || !statSync(component_root_dir).isDirectory()) {
        logger.error(`${component_type === 'app' ? `gateway${sep}apps` : 'microservices'} directory not found: ${component_root_dir}`);
        exit(1);
    }

    // Check if the component directory exists
    if (!existsSync(component_root_dir) || !statSync(component_root_dir).isDirectory()) {
        logger.error(`Microservices directory not found: ${component_root_dir}`);
    }

    // Get a list of directories in the component directory
    let components_directories: string[]
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
                logger.error(`No such service under microservices workspace: ${service}`)
                exit(1)
            }
        });
        // .filter(item => {
        // });
    }
    return { component_root_dir, components_directories }
}

const startServices = async ({ services, mode, vanilla }: { services: string[], mode: string, vanilla: boolean }) => {
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
        runDockerizedServices({ services, mode, vanilla })
    }
    // TODO: listen on SIGTERM and other kill signals to exit gracefully eg with CTRL+[C,D,Z]
};

export {
    generateDirectoryPath,
    changeDirectory,
    isMatch,
    getPlatform,
    checkDocker,
    startDocker,
    installDepsAtWorkspace,
    addDepsAtWorkspace,
    startAll,
    start,
    startApps,
    startServices,
    pathExists
}

// module.exports = {
//     generateDirectoryPath,
//     changeDirectory,
//     isMatch,
//     getPlatform,
//     checkDocker,
//     startDocker,
//     installDepsAtWorkspace,
//     addDepsAtWorkspace,
//     startAll,
//     start,
//     startApps,
//     startServices,
//     pathExists
// }