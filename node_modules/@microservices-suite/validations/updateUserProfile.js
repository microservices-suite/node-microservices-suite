
const Joi = require('joi')
const mongoose = require('mongoose')

const updateProfileValidation = {
    params: Joi.object().keys({
        id: Joi.string().custom((value) => (value === mongoose.Types.ObjectId))
    })
}

module.exports = updateProfileValidation