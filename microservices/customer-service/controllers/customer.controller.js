const getAllCustomer = async(req, res) => {
    try {        
        res.status(200).send({ data: ["This is getAllCustomer"]})
    } catch (error) {
        console.log(error)
    }
}

const createCustomer = async(req, res) => {
    try {
        res.status(201).send({data : []})        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllCustomer,
    createCustomer
}