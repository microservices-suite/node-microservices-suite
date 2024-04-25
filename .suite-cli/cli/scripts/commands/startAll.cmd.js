
const { startAll, logError } = require('../scripts.module')

module.exports = async ({ options }) => {
    try {
        await startAll({ options });
    } catch (errors) {
        logError({ errors })
    }
};