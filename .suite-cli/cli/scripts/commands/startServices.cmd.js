
const { startServices, logError } = require('../scripts.module')

module.exports = async ({ components, options }) => {
    try {
        await startServices({ services: components, mode: options.mode, vanilla: options.vanilla });
    } catch (errors) {
        logError({ errors })
    }
};