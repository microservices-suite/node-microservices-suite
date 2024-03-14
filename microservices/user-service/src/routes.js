const express = require('express');
const controllers =  require('./controller');
const { validate } = require('../../libraries/utilities/validate');
const router =  express.Router()

router
.all('/users')
.post(validate(validations.createUser),controllers.createUser)
.get(controllers.getUsers)
router.all('/users/:id')
.get('/users/:id',validate(validations.getUser),controllers.getUser)

module.exports = {
    router
}