const mongoose = require('mongoose');
const OrderHistoryModel = require('./orderHistory');
const UserBooksModel = require('./userBooks');
const BookReviewsModel = require('./bookReviews');
const BelongsModel = require('./bookBelongsToCategory');

const bookSchema = mongoose.Schema({
    title: String,
    genre: String,
    author: String,
    price: Number,
    isbn: String,
    description: String,
    availability: Boolean,
    imageUrl: String,
    createdAt: Date,
    file: String
});

bookSchema.pre('remove', async function (next) {
    const bookId = this._id;

    const relatedModels = [
        OrderHistoryModel,
        UserBooksModel,
        BookReviewsModel,
        BelongsModel
    ];

    for (const model of relatedModels) {
        await model.deleteMany({ bookId });
    }

    next();
});


const BookModel = mongoose.model('Book', bookSchema);

class Book {
    constructor(bookData) {
        this._id = bookData._id;
        this.title = bookData.title;
        this.genre = bookData.genre;
        this.author = bookData.author;
        this.price = bookData.price;
        this.isbn = bookData.isbn;
        this.description = bookData.description;
        this.availability = true;
        this.imageUrl = "/images/'book-composition-with-open-book_23-2147690555'";
        this.createdAt = bookData.createdAt;
        this.file = "/pdfs/'Software Engineering - Ian Sommerville'";
    }

    static async findBookById(_id) {
        const bookData = await BookModel.findById(_id);
        return bookData;
    }    
}

module.exports = {Book, BookModel};