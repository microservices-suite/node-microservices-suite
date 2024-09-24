
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  supplierController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/suppliers')
    .post(supplierController.createSupplier)
    .get(supplierController.getSuppliers);

router
    .route('/suppliers/:id')
    .get(supplierController.getSupplier)
    .patch(supplierController.updateSupplier)
    .delete(supplierController.deleteSupplier);

module.exports = router;
