const express = require('express');
const { validate } = require('@microservices-suite/utilities');
const { getUserValidation, createUserValidation, updateProfileValidation } = require('@microservices-suite/validations')
const controllers = require('./controllers');

const router = express.Router()

router
    .route('/users')
    .post(validate(createUserValidation), controllers.createUser)
    .get(controllers.getUsers)
router
    .route('/users/:id')
    .get(validate(getUserValidation), controllers.getUser)
    .patch(validate(updateProfileValidation), controllers.updateProfile)

module.exports = { router }