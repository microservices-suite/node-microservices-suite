module.exports = () => `
const Joi = require('joi')
const pick = require('./pick')
const { APIError } = require('.')

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'body', 'query'])
  const filterdRequest = pick(req, Object.keys(validSchema))
  const { error, warning, value } = Joi.compile(validSchema).preferences({ abortEarly: false, convert: true, allowUnknown: true }).validate(filterdRequest)
  if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      next(new APIError(400, errorMessage));
  }
  next()
}

module.exports = validate
`;