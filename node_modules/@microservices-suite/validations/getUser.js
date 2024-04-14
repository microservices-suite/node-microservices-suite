const Joi = require('joi')
const { default: mongoose } = require('mongoose')

const getUser = {
    params: Joi.object().keys({
        id: Joi.string().custom((value) => (value === mongoose.Types.ObjectId))
    })
}

module.exports = getUser