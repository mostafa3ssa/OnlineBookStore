const mongoose = require('mongoose');

const orderHistorySchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bankId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank', required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
});


const OrderHistoryModel = mongoose.model('OrderHistory', orderHistorySchema);


class OrderHistory {
    constructor(orderData) {
        this.userId = orderData.userId;
        this.bankId = orderData.bankId;
        this.bookId = orderData.bookId;
        this.orderId = orderData.orderId;
    }

}


module.exports = {OrderHistory, OrderHistoryModel};

