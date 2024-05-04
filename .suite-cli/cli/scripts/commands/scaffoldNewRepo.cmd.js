
const { scaffoldNewRepo, logError } = require('../scripts.module')

module.exports = async ({ repo_answers }) => {
    try {
        await scaffoldNewRepo({ answers:repo_answers });
    } catch (error) {
        logError({ error })
    }
}