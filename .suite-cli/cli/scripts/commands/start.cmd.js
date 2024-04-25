
const { start, logError } = require('../scripts.module')

module.exports = async ({  components, options }) => {
    try {
        await start({  components, options });
    } catch (errors) {
        logError({ errors })
    }
};