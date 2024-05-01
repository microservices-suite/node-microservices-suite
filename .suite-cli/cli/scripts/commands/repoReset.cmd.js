
const { repoReset } = require('../scripts.module')

module.exports = async ({ components, options }) => {
    repoReset({ components, options });
};