#!/usr/bin/env node

const {program} = require('commander')
const {addDepsAtWorkspacecmd} = require('.')
program.version('1.0.0')
program.argument('<service>','service to run')
addDepsAtWorkspacecmd
program.option('<mode>','mode to run the server 🚀','dev')
program.action((mode)=>console.log({mode}))

program.parse(process.argv)