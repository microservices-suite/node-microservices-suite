
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  paymentController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/payments')
    .post(paymentController.createPayment)
    .get(paymentController.getPayments);

router
    .route('/payments/:id')
    .get(paymentController.getPayment)
    .patch(paymentController.updatePayment)
    .delete(paymentController.deletePayment);

module.exports = router;
