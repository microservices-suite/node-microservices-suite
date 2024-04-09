const express = require('express');
const router = express.Router();
const clientRoute = require('./client');

const defaultRoutes = [
    { path : '', route : clientRoute}
];

defaultRoutes.forEach(route=>{
    router.use( route.path, route.route)
});

module.exports = router