const express = require('express')
const router = express.Router()
const {supllierController} = require('../../controllers')

router.route('/')
    .get(supllierController.getAllSupplier)
    .post(supllierController.createSupplier)

module.exports = router