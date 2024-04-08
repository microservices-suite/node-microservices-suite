const express = require('express')
const router = express.Router()
const supplierRouter = require('./supplier.route')

const defaultRoutes = [
    { path: '/supplier' , route : supplierRouter}
]

defaultRoutes.forEach( route => {
    router.use(route.path, route.route)
})

module.exports = router