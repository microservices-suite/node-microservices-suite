
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  thController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/ths')
    .post(thController.createTh)
    .get(thController.getThs);

router
    .route('/ths/:id')
    .get(thController.getTh)
    .patch(thController.updateTh)
    .delete(thController.deleteTh);

module.exports = router;
