
const { stopApps } = require('../scripts.module')

module.exports = async ({ components, options }) => {
    stopApps({ components, options });
};