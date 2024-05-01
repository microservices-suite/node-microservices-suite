
const { startApps, logError } = require('../scripts.module')

module.exports = async ({ components, options }) => {
    try {
        await startApps({ apps: components, options });
    } catch (errors) {
        logError({ errors })
    }
};