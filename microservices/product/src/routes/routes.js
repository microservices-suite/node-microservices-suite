
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  productController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/products')
    .post(productController.createProduct)
    .get(productController.getProducts);

router
    .route('/products/:id')
    .get(productController.getProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;
