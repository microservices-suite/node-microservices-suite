
const { ObjectId } = require('mongodb');
const Notification  = require('../models/models');

const createNotification = async ({ body }) => {
    const notification = await Notification.create(body);
    return { notification };
};

const getNotifications = async () => {
    const notifications = await Notification.find({});
    return { notifications };
};

const getNotificationById = async ({ id }) => {
    const notification = await Notification.findById(id);
    return { notification };
};

const updateNotificationProfile = async ({ id, body }) => {
    const upserted_notification = await Notification.updateOne({ _id: ObjectId(id)  }, { ...body }, { upsert: false });
    return { upserted_notification };
};

const deleteNotification = async ({ id }) => {
    await Notification.deleteOne({ _id: ObjectId(id) });
};
module.exports = {
    createNotification,
    getNotifications,
    getNotificationById,
    updateNotificationProfile,
    deleteNotification
};
