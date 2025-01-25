const  {SiteRanking, siteRankingModel} = require('../models/siteRanking');
const { sendNotification } = require('./notification');

const addSiteRanking = async (userId, text, rating) => {
    const date = Date.now();
    await siteRankingModel.create({
        userId,
        text,
        rating,
        date
    });

    const notificationText = `Thank you for rating our website`;
    const notificationType = "Ranking";
    const noti = await sendNotification(userId, notificationText, notificationType);
    const relation = new SiteRanking({userId, text, date});
    console.log(text);
    return relation;
};

const getSiteRankings = async () => {
    const rankings = await siteRankingModel.find({});
    return rankings;
};

module.exports = {addSiteRanking, getSiteRankings};
