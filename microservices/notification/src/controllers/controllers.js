
const services = require('../services/services');
const { asyncErrorHandler, APIError } = require('@microservices-suite/utilities');

const createNotification = asyncErrorHandler(async (req, res) => {
    const { body } = req;
    const { notification: data } = await services.createNotification({ body });
    res.status(201).json({ data });
});

const getNotifications = asyncErrorHandler(async (req, res) => {
    const { notifications: data } = await services.getNotifications();
    res.status(200).json({ data });
});

const getNotification = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { notification: data } = await services.getNotificationById({ id });
    if (!data) {
        throw new APIError(404, 'notification not found');
    }
    res.status(200).json({ data });
});

const updateNotification = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { notification } = await services.getNotificationById({ id });
    if (!notification) {
        throw new APIError(404, 'notification not found');
    }
    const { upserted_notification: data } = await services.updateNotificationProfile({ id, body });
    res.status(200).json({ data });
});

const deleteNotification = asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const { notification } = await services.getNotificationById({ id });
    if (!notification) {
        throw new APIError(404, 'notification not found');
    }
    await services.deleteNotification({ id });
    res.status(200).json({ message: 'Deletion successful' });
});
module.exports = {
    createNotification,
    getNotifications,
    getNotification,
    updateNotification,
    deleteNotification
};

