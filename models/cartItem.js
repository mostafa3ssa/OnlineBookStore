const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    status: Boolean
});

const CartItemModel = mongoose.model('CartItem', cartItemSchema);

class CartItem {
    constructor(cartItemData) {
        this.userId = cartItemData.userId;
        this.cartId = cartItemData.cartId;
        this.bookId = cartItemData.bookId;
        this.status = cartItemData.status;
    }

    static async findItemDetails(userId, cartId, bookId) {
        const cartItemDetails = await CartItemModel.findOne({userId, cartId, bookId});
        return cartItemDetails;
    }
}


module.exports = {CartItem, CartItemModel};




