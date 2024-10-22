
const { removeResource, logError } = require('../scripts.module')

module.exports = async ({ answers }) => {
    try {
        await removeResource({ answers });
    } catch (error) {
        logError({ error })
    }
}