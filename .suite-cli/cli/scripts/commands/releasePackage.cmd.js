
const { releasePackage } = require('../scripts.module')

module.exports = async ({ pkg }) => {
    releasePackage({ pkg });
};