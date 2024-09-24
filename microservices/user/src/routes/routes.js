
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  userController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/users')
    .post(userController.createUser)
    .get(userController.getUsers);

router
    .route('/users/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
