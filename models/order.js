const mongoose = require('mongoose');

const OrderHistoryModel = require('./orderHistory');

const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank', required: true },
    price: Number,
    date: Date,
    status: Boolean
});

orderSchema.pre('remove', async function (next) {
    const orderId = this._id;

    const relatedModels = [
        OrderHistoryModel
    ];

    for (const model of relatedModels) {
        await model.deleteMany({ orderId });
    }

    next();
});


const OrderModel = mongoose.model('Order', orderSchema);


class Order {
    constructor(orderData) {
        this._id = orderData._id;
        this.userId = orderData.userId;
        this.bankId = orderData.bankId;
        this.price = orderData.price;
        this.date = orderData.date;
        this.status = orderData.status;
    }

}


module.exports = {Order, OrderModel};

