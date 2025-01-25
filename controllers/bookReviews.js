const  {BookReviews, BookReviewsModel} = require('../models/bookReviews');
const { getBookDetails } = require('./book');
const { sendNotification } = require('./notification');

const addBookReview = async (bookId, userId, text) => {
    const date = Date.now();
    await BookReviewsModel.create({
        bookId,
        userId,
        text,
        date
    });

    const book = await getBookDetails(bookId);
    const bookName = book.title;
    const notificationText = `You have reviewed ${bookName}`;
    const notificationType = "Review";
    const noti = await sendNotification(userId, notificationText, notificationType);
    const relation = new BookReviews({bookId, userId, text, date});
    console.log(text);
    return relation;
};

const getBookReviews = async (bookId) => {
    const reviews = await BookReviewsModel.find({bookId});
    return reviews;
};

module.exports = {addBookReview, getBookReviews};
