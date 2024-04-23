
const { isMatch, logSuccess, startAll } = require('./scripts.module')

module.exports = async ({ options }) => await startAll({ options });