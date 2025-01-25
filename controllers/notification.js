const {Notification, NotificationModel} = require('../models/notification'); 

const sendNotification = async (userId, notificationText, notificationType) => {
    const notificationDate = Date.now();
    const isRead = false;
    await NotificationModel.create({
        userId,
        notificationText,
        notificationType,
        notificationDate,
        isRead
    });
    const sentNotification = await NotificationModel.findOne({userId, notificationDate});
    const _id = sentNotification._id;
    const newNotification = new Notification({_id, userId, notificationText, notificationType, notificationDate});
    return newNotification;
};

const getNotificationDetails = async(_id) => {
    const myNotification = await NotificationModel.findById(_id);
    return myNotification;
};

const getAllNotifications = async(userId) => {
    const notifications = await NotificationModel.find({ userId });
    return notifications;
}
module.exports = {sendNotification, getNotificationDetails, getAllNotifications};