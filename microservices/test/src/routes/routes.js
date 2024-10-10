
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  testController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/tests')
    .post(testController.createTest)
    .get(testController.getTests);

router
    .route('/tests/:id')
    .get(testController.getTest)
    .patch(testController.updateTest)
    .delete(testController.deleteTest);

module.exports = router;
