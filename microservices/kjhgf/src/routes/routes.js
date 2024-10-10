
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  kjhgfController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/kjhgfs')
    .post(kjhgfController.createKjhgf)
    .get(kjhgfController.getKjhgfs);

router
    .route('/kjhgfs/:id')
    .get(kjhgfController.getKjhgf)
    .patch(kjhgfController.updateKjhgf)
    .delete(kjhgfController.deleteKjhgf);

module.exports = router;
