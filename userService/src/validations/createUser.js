const Joi = require('joi')
const { default: mongoose } = require('mongoose')

const createUser = {
    body:Joi.object().keys({
        name:Joi.string().required(),
        email:Joi.string().email(),
        password:Joi.string().required()
    }
    )
}
module.exports = createUser
