const {Category, CategoryModel} = require('../models/category'); 

const addCategory = async (categoryName, categoryDescription) => {
    await CategoryModel.create({
        categoryName,
        categoryDescription
    });
    const createdCategory = await CategoryModel.findOne({categoryName});
    const _id = createdCategory._id;
    const newCategory = new Category({_id, categoryName, categoryDescription});
    return newCategory;
};

const getCategory = async(_id) => {
    const myCategory = await CategoryModel.findById(_id);
    return myCategory;
};


module.exports = {addCategory, getCategory};

