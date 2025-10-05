const { scaffoldNewLibrary, logError } = require('../scripts.module')

module.exports = async ({ answers }) => {
    try {
        await scaffoldNewLibrary({ answers });
    } catch (error) {
        logError({ error })
    }
}