const  {Support, SupportModel} = require('../models/support');
const { sendNotification } = require('./notification');

const sendIssue = async (userId, type, message) => {
    const status = false;
    await SupportModel.create({
        userId,
        type,
        message,
        status
    });

    const notificationText = `Thank you for contacting us. Your issue will be resolved soon.`;
    const notificationType = "Issue";
    const noti = await sendNotification(userId, notificationText, notificationType);
    const relation = new Support({userId, type, message, status});
    console.log(message);
    return relation;
};

const getIssues = async () => {
    const issues = await SupportModel.find({});
    return issues;
};

module.exports = {sendIssue, getIssues};
