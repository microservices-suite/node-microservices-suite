const getAllCustomer = async(req, res) => {
    res.status(200).send({ data: []})
}

const createCustomer = async(req, res) => {
    res.status(201).send({data : []})
}

module.exports = {
    getAllCustomer,
    createCustomer
}