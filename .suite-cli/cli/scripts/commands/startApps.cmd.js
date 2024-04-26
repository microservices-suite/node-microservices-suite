
const { startApps, logError } = require('../scripts.module')

module.exports = async ({ components, options }) => {
    try {
        await startApps({ apps: components, mode: options.mode, kubectl: options.kubectl });
    } catch (errors) {
        logError({ errors })
    }
};