const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notificationText: String,
    notificationType: String,
    notificationDate: Date,
    isRead: Boolean
});


const NotificationModel = mongoose.model('Notification', notificationSchema);


class Notification {
    constructor(notificationData) {
        this._id = notificationData._id;
        this.userId = notificationData.userId;
        this.notificationText = notificationData.notificationText;
        this.notificationType = notificationData.notificationType;
        this.notificationDate = notificationData.notificationDate;
        this.isRead = false;
    }

    static async findNotificationById(_id) {
        const notificationData = await NotificationModel.findById(_id);
        return notificationData;
    }
}


module.exports = {Notification, NotificationModel};
