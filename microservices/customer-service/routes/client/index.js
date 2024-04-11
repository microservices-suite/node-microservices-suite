const express = require('express');
const router = express.Router();
const customerRouter = require('./customer.route');
const customerReportRouter = require('./customerReport.route')

const defaultRoutes = [
    { path : '', route : customerRouter},
    { path : '/customer-report', route : customerReportRouter}
];

defaultRoutes.forEach( route => {
    router.use(route.path, route.route)
});

module.exports = router