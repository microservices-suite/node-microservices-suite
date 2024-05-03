
const { dockerPrune } = require('../scripts.module')

module.exports = async ({ options }) => {
    dockerPrune({ all: options.all, volume: options.volume, force: options.force });
};