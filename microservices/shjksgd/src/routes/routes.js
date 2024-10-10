
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  shjksgdController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/shjksgds')
    .post(shjksgdController.createShjksgd)
    .get(shjksgdController.getShjksgds);

router
    .route('/shjksgds/:id')
    .get(shjksgdController.getShjksgd)
    .patch(shjksgdController.updateShjksgd)
    .delete(shjksgdController.deleteShjksgd);

module.exports = router;
