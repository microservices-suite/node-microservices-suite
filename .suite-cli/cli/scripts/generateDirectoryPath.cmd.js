
const { generateDirectoryPath, logInfo } = require('./scripts.module')
const { program } = require('commander');


program
    .command('generate-path')
    .description('Dynamically generate directory path given workspace_name')
    .argument('<workspace-name>', 'Name of the workspace to cd into')
    .option('-d, --workspace-directory <directory>', 'Directory where to look for the workspace. Defaults to "microservices"', 'microservices')
    .action((workspace_name, options) => {
        const path = generateDirectoryPath({
            workspace_name,
            workspace_directory: options.workspaceDirectory
        });
        logInfo({ message: path })
    });
program.parse(process.argv);
module.exports = program