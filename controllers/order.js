const {Order, OrderModel} = require('../models/order');

const addOrder = async (userId, bankId, price) => {
    const status = true;
    const date = Date.now();
    await OrderModel.create({
        userId,
        bankId,
        price,
        date,
        status
    });
    const myOrder = await OrderModel.findOne({ userId }).sort({ _id: -1 }); 
    console.log(myOrder);
    const _id = myOrder._id;
    const relation = new Order({_id, userId, bankId, price, date, status});
    return relation;
};


module.exports = {addOrder};
