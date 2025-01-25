const mongoose = require('mongoose');

const siteRankingSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    date: Date
});


const siteRankingModel = mongoose.model('SiteRanking', siteRankingSchema);


class SiteRanking {
    constructor(reviewData) {
        this.userId = reviewData.userId;
        this.rating = reviewData.rating;
        this.text = reviewData.text;
        this.date = reviewData.date;
    }
}


module.exports = {SiteRanking, siteRankingModel};
