
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  rbacController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/rbacs')
    .post(rbacController.createRbac)
    .get(rbacController.getRbacs);

router
    .route('/rbacs/:id')
    .get(rbacController.getRbac)
    .patch(rbacController.updateRbac)
    .delete(rbacController.deleteRbac);

module.exports = router;
