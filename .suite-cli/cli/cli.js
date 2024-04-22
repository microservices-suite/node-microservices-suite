#!/usr/bin/env node

const figlet = require('figlet')
const { program } = require("commander");
console.log(figlet.textSync('Microservices-Suite'))
const {
    addDepsAtWorkspace,
    installDepsAtWorkspace,
    changeDirectory,
    isMatch,
    logSuccess,
    logError,
    logInfoMessage,
    pathExists,
    generateDirectoryPath,
    checkDocker,
    getPlatform,
    startDocker
} = require("./scripts");

const [, , command, ...args] = process.argv;
console.log({ command, args })
switch (command) {
    case add:
        addDepsAtWorkspace(args)
    case add:
        installDepsAtWorkspace(args)
    case add:
        logInfoMessage(args)
    case add:
        logError(args)
    case add:
        logSuccess(args)
    case add:
        changeDirectory(args)
    case add:
        isMatch(args)
    case add:
        generateDirectoryPath(args)
    case add:
        checkDocker(args)
    case add:
        getPlatform(args)
    case add:
        pathExists(args)
    case add:
        startDocker(args)
}