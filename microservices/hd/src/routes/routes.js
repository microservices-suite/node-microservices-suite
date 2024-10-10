
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  hdController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/hds')
    .post(hdController.createHd)
    .get(hdController.getHds);

router
    .route('/hds/:id')
    .get(hdController.getHd)
    .patch(hdController.updateHd)
    .delete(hdController.deleteHd);

module.exports = router;
