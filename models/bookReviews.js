const mongoose = require('mongoose');

const bookReviewsSchema = mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: String,
    date: Date
});


const BookReviewsModel = mongoose.model('BookReviews', bookReviewsSchema);


class BookReviews {
    constructor(reviewData) {
        this.bookId = reviewData.bookId;
        this.userId = reviewData.userId;
        this.text = reviewData.text;
        this.date = reviewData.date;
    }
}


module.exports = {BookReviews, BookReviewsModel};
