const mongoose = require('mongoose');
const CartItemModel = require('./cartItem');

const cartSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, default: 0 }
});

cartSchema.pre('remove', async function (next) {
    const cartId = this._id;

    const relatedModels = [
        CartItemModel
    ];

    for (const model of relatedModels) {
        await model.deleteMany({ cartId });
    }

    next();
});


const CartModel = mongoose.model('Cart', cartSchema);

class Cart {
    constructor(cartData) {
        this._id = cartData._id;
        this.userId = cartData.userId;
        this.totalAmount = cartData.totalAmount || 0;
    }

    static async findCartByUserId(userId) {
        const cartData = await CartModel.findOne({userId});
        return cartData;
    }
}


module.exports = {Cart, CartModel};




