const {UserBooks, UserBooksModel} = require('../models/userBooks');
const {Book, BookModel} = require('../models/book'); 
const {addBook, getBookDetails} = require('../controllers/book');
const {sendNotification} = require('../controllers/notification');
const addUserBook = async (bookId, userId) => {
    await UserBooksModel.create({
        bookId,
        userId
    });
    const myBook = await getBookDetails(bookId);
    const bookName = myBook.title;
    const notificationText = `You have purchased ${bookName}`;
    const notificationType = "Payment";
    const noti = await sendNotification(userId, notificationText, notificationType);
    const relation = new UserBooks({bookId, userId});
};

const getUserBooks = async (userId) => {
    const books = await UserBooksModel.find({userId});
    let myBooks = [];
    for(let i = 0; i < books.length; ++i) {
        const myBook = await getBookDetails(books[i].bookId);
        myBooks.push(myBook);
    }
    return myBooks;
};

module.exports = {addUserBook, getUserBooks};
