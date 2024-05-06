
const { releasePackage } = require('../scripts.module')

module.exports = async ({ package }) => {
    releasePackage({ package });
};