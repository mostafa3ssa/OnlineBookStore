const {OrderHistory, OrderHistoryModel} = require('../models/orderHistory');

const addOrderDetails = async (userId, bankId, bookId, orderId) => {
    await OrderHistoryModel.create({
        userId,
        bankId,
        bookId,
        orderId
    });
    const myOrder = OrderHistoryModel.findOne({userId, bookId, orderId});
    const relation = new OrderHistory({userId, bankId, bookId, orderId});
    
};


module.exports = {addOrderDetails};
