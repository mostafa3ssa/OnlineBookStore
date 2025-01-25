const mongoose = require('mongoose');

const belongsSchema = mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});


const BelongsModel = mongoose.model('Belongs', belongsSchema);


class Belongs {
    constructor(BelongsData) {
        this.booId = BelongsData.bookId;
        this.categoryId = BelongsData.categoryId;
    }
}


module.exports = {Belongs, BelongsModel};
