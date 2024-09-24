
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}
    , {
        timestamps: true
    });

const Notification = mongoose.model('notification', notificationSchema);

module.exports =  Notification;
