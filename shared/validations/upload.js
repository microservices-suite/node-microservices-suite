const Joi = require('joi')
const { default: mongoose } = require('mongoose')

const uploadValidation = {
    body: Joi.object().keys({
        file: Joi.string().custom((value) => (value === mongoose.Types.ObjectId))
    })
}
const bulkUploadValidation = {
    body: Joi.object().keys({
        files: Joi.string().custom((value) => (value === mongoose.Types.ObjectId))
    })
}

module.exports = getUser