
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  cartController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/carts')
    .post(cartController.createCart)
    .get(cartController.getCarts);

router
    .route('/carts/:id')
    .get(cartController.getCart)
    .patch(cartController.updateCart)
    .delete(cartController.deleteCart);

module.exports = router;
