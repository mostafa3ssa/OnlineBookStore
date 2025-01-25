const mongoose = require('mongoose');

const userBooksSchema = mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


const UserBooksModel = mongoose.model('UserBooks', userBooksSchema);


class UserBooks {
    constructor(UserBooksData) {
        this.booId = UserBooksData.bookId;
        this.userId = UserBooksData.userId;
    }
}


module.exports = {UserBooks, UserBooksModel};
