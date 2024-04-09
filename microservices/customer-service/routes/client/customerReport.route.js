const express = require('express')
const router = express.Router()
const {customerReportController} = require('../../controllers')


router.route('/get_all_orders')
    .get( customerReportController.getCustomerReport)

module.exports = router