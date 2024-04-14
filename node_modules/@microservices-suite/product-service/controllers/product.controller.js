const getAllProduct = async(req, res) => {
    try {        
        res.status(200).send({ data : ["This is the getAllProduct"]})
    } catch (error) {
        console.log(error)
    }
}

const createProduct = async(req, res) => {
    try {
        res.status(201).send({data : ["This is the create product"]})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllProduct,
    createProduct
}