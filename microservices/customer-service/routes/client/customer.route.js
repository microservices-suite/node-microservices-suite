const express = require('express')
const router = express.Router()
const {cusomterController} = require('../../controllers')

router.route('/')
    .get( cusomterController.getAllCustomer)
    .post( cusomterController.createCustomer)

module.exports = router