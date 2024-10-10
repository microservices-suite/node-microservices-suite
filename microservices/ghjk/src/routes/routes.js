
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  ghjkController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/ghjks')
    .post(ghjkController.createGhjk)
    .get(ghjkController.getGhjks);

router
    .route('/ghjks/:id')
    .get(ghjkController.getGhjk)
    .patch(ghjkController.updateGhjk)
    .delete(ghjkController.deleteGhjk);

module.exports = router;
