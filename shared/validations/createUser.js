const Joi = require('joi')

const createUser = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email(),
        password: Joi.string().required()
    }
    )
}
module.exports = createUser