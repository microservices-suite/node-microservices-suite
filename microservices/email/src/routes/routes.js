
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  emailController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/emails')
    .post(emailController.createEmail)
    .get(emailController.getEmails);

router
    .route('/emails/:id')
    .get(emailController.getEmail)
    .patch(emailController.updateEmail)
    .delete(emailController.deleteEmail);

module.exports = router;
