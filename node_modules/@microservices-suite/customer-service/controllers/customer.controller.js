const { publishMessage, subscribeMessage} = require('../utils/index')
const {PRODUCT_BINDING_KEY, CUSTOMER_BINDING_KEY, SUPPLIER_BINDING_KEY} = require('../config/index')

const getAllCustomer = async(req, res) => {
    try {        
        // subscribeMessage(req.rabbitMQChannel,"")
        publishMessage(req.rabbitMQChannel, SUPPLIER_BINDING_KEY, JSON.stringify({ "name" : "customer"}))   

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