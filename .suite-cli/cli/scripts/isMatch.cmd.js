
const { isMatch, logSuccess } = require('./scripts.module')

module.exports = ({ a, b }) => {
    isMatch({ a, b }) ? logSuccess({ message: true }) : logError({ error: false })
    isMatch({ a, b });
}