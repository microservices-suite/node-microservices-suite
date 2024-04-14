const express = require('express')
const produtRouter = require('./product.route')

const router = express.Router()

const defaultRoutes = [
    { path : '', route: produtRouter}
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router