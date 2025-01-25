const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    categoryName: String,
    categoryDescription: String
});


const CategoryModel = mongoose.model('Category', categorySchema);


class Category {
    constructor(categoryData) {
        this._id = categoryData._id;
        this.categoryName = categoryData.bankName;
        this.categoryDescription = categoryData.categoryDescription;
    }

    static async findCategoryById(_id) {
        const categoryData = await CategoryModel.findById(_id);
        return categoryData;
    }
}


module.exports = {Category, CategoryModel};
