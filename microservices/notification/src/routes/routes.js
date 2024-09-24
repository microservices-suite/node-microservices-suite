
const express = require('express');
const { validate } = require('@microservices-suite/utilities');

const  notificationController  = require('../controllers/controllers');

const router = express.Router();

router
    .route('/notifications')
    .post(notificationController.createNotification)
    .get(notificationController.getNotifications);

router
    .route('/notifications/:id')
    .get(notificationController.getNotification)
    .patch(notificationController.updateNotification)
    .delete(notificationController.deleteNotification);

module.exports = router;
