
const { scaffoldNewService, logError } = require('../scripts.module')

module.exports = async ({ answers }) => {
    try {
        await scaffoldNewService({ answers });
    } catch (error) {
        logError({ error })
    }
}