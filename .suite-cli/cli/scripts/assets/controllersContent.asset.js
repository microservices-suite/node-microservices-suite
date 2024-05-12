module.exports = ({ answers }) => `
const services = require('../services')
const { asyncErrorHandler, APIError } = require('${answers.project_base}/utilities')
const hello = asyncErrorHandler(async (req, res) => {
    res.status(200).json({ data:'Hello from ${answers.project_base}/${answers.service_name}' })
})
module.exports = {
    hello,
}`;