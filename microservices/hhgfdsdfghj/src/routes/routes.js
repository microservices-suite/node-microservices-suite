
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  hhgfdsdfghjController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/hhgfdsdfghjs')
    .post(hhgfdsdfghjController.createHhgfdsdfghj)
    .get(hhgfdsdfghjController.getHhgfdsdfghjs);

router
    .route('/hhgfdsdfghjs/:id')
    .get(hhgfdsdfghjController.getHhgfdsdfghj)
    .patch(hhgfdsdfghjController.updateHhgfdsdfghj)
    .delete(hhgfdsdfghjController.deleteHhgfdsdfghj);

module.exports = router;
