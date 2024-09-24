
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  uploadController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/uploads')
    .post(uploadController.createUpload)
    .get(uploadController.getUploads);

router
    .route('/uploads/:id')
    .get(uploadController.getUpload)
    .patch(uploadController.updateUpload)
    .delete(uploadController.deleteUpload);

module.exports = router;
