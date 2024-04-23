
const { logError } = require('./scripts.module')

module.exports = ({ error }) => {
    logError({ error });
}