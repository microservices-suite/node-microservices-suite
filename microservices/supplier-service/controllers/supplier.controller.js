const { publishMessage , subscribeMessage} = require('../utlis/index')
const {PRODUCT_BINDING_KEY, CUSTOMER_BINDING_KEY, SUPPLIER_BINDING_KEY} = require('../config/index')
const { json } = require('express')

const getAllSupplier = async(req, res) => {
    try {    
        // const channel = req.rabbitMQChannel; 
        publishMessage(req.rabbitMQChannel, CUSTOMER_BINDING_KEY, JSON.stringify({ "name" : "Supplie"}))   
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