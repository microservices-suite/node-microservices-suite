
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  customerController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/customers')
    .post(customerController.createCustomer)
    .get(customerController.getCustomers);

router
    .route('/customers/:id')
    .get(customerController.getCustomer)
    .patch(customerController.updateCustomer)
    .delete(customerController.deleteCustomer);

module.exports = router;
