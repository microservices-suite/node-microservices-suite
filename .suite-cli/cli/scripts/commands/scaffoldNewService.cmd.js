
const { scaffoldNewService, logError } = require('../scripts.module')

module.exports = async ({ answers }) => {
    try {
        console.log({answers})

        await scaffoldNewService({ answers });
    } catch (error) {
        logError({ error })
    }
}