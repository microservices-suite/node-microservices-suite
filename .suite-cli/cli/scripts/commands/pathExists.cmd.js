
const { pathExists, logInfo, logError } = require('../scripts.module')
const { statSync } = require('fs')

module.exports = ({ file_path }) => {
    pathExists({ file_path }) ? logInfo({ message: `${statSync(file_path).isFile() ? 'File' : 'Directory'} found:- ${file_path}` }) : logError({ error: `Path not found:- ${file_path}` })
}