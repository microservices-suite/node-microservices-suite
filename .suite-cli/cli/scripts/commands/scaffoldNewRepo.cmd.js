
const { scaffoldNewRepo, logError } = require('../scripts.module')

module.exports = async ({ answers }) => {
    try {
        await scaffoldNewRepo({ answers });
    } catch (error) {
        logError({ error })
    }
}