const getAllSupplier = async(req, res) => {
    try {        
        res.status(200).send({data : ["This is getAllSupplier"]})
    } catch (error) {
        console.log(error)
    }
}

const createSupplier = async(req, res) => {
    try {        
        res.status(201).send({data : ["This is createSupplier"]})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllSupplier,
    createSupplier
}