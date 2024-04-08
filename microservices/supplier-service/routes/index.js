const express = require('express')
const router = express.Router()
const clientRouter = require('./client')

const defaultRoutes = [
    { path : '' , rotue : clientRouter}
]

defaultRoutes.forEach( route => {
    router.use( route.path, route.rotue)
})

module.exports = router