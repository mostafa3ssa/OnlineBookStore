const {Belongs, BelongsModel} = require('../models/bookBelongsToCategory');

const addBookCategory = async (bookId, categoryId) => {
    await BelongsModel.create({
        bookId,
        categoryId
    });

    const relation = new Belongs({bookId, categoryId});
};

const getBookCategories = async (bookId) => {
    const categories = await BelongsModel.find({bookId});
    return categories;
};

const getCategoryBooks = async (categoryId) => {
    const books = await BelongsModel.find({categoryId});
    return books;
};
module.exports = {addBookCategory, getBookCategories, getCategoryBooks};
