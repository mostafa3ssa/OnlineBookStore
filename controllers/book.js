const {Book, BookModel} = require('../models/book'); 
const {addBookCategory} = require('../controllers/bookBelongsToCategory');
const {Category, CategoryModel} = require('../models/category'); 

const addBook = async (title, genre, author, price, isbn, description, createdAt, listOfCategories) => {
    const imageUrl = "/images/'book-composition-with-open-book_23-2147690555'";
    const file = "/pdfs/'Software Engineering - Ian Sommerville'";
    const availability = true;
    await BookModel.create({
        title,
        genre,
        author,
        price,
        isbn,
        description,
        availability,
        imageUrl,
        createdAt,
        file
    });
    const createdBook = await BookModel.findOne({title});
    const _id = createdBook._id;
    const newBook = new Book({_id, title, genre, author, price, isbn, description, createdAt});
    const bookId = _id;
    for(let i = 0; i < listOfCategories.length; ++i) {
        const categoryName = listOfCategories[i];
        const category = await CategoryModel.findOne({categoryName});
        const categoryId = category._id;
        addBookCategory(bookId, categoryId);
    }
    return newBook;
};

const getBookDetails = async(_id) => {
    const myBook = await BookModel.findById(_id);
    return myBook;
};


module.exports = {addBook, getBookDetails};