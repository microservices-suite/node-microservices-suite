const httpstatus = require('http-status')

const getAllProduct = async(req, res) => {
    res.status(200).send({ data : []})
}

const createProduct = async(req, res) => {
    res.status(201).send({data : []})
}

module.exports = {
    getAllProduct,
    createProduct
}