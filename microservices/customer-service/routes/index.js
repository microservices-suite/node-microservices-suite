const express = require('express');
const router = express.Router();
const customerRoute = require('./client');

const defaultRoutes = [
    { path : '', rotue : customerRoute}
];

defaultRoutes.forEach((rotue)=>{
    router.use( route.path, route.rotue)
});

module.exports = router;