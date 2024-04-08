const getAllSupplier = async(req, res) => {
    res.status(200).send({data : []})
}

const createSupplier = async(req, res) => {
    res.status(201).send({data : []})
}

module.exports = {
    getAllSupplier,
    createSupplier
}