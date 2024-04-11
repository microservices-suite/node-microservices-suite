
const Joi = require('joi')

const deleteValidation = {
    params: Joi.object().keys({
        public_id: Joi.string().required(),
    }
    )
}
const bulkUploadValidation = {
    files: Joi.object().keys({
        files: Joi.array().required(),
    }
    )
}
const uploadValidation = {
    file: Joi.object().keys({
        file: Joi.string().required(),
    }
    )
}
module.exports = {
    uploadValidation,
    bulkUploadValidation,
    deleteValidation
}