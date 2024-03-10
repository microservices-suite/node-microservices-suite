const Joi = require('joi')
const { pick } = require('./pick')

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'body', 'query'])
    const filterdRequest = pick(req, Object.keys(validSchema))
    const { error, warning, value } = Joi.compile(validSchema).preferences({ abortEarly: false, convert: true, allowUnknown: true }).validate(filterdRequest)
    if (error) {
        let processedErrors = {};
        error.details.forEach(detail => {
            const fieldName = detail.context.label.split('.')[1]; // Extract field name from label
            processedErrors[fieldName] = detail.message.replace(detail.context.label, fieldName); // Replace label with field name
        });
        next(processedErrors)
    }
    next()
}

module.exports = {
    validate
}