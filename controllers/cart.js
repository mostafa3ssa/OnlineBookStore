const {Cart, CartModel} = require('../models/cart'); 
const mongoose = require('mongoose');
const addCart = async (userId) => {
    const totalAmount = 0;
    await CartModel.create({
        userId,
        totalAmount
    });
    const createdCart = await CartModel.findOne({userId});
    const _id = createdCart._id;
    const newCart = new Cart({_id, userId, totalAmount});
    return newCart;
};

const getTotalAmount = async(userId) => {
    const myCart = await CartModel.findOne({ userId });
    console.log("Data from the getTotalAmount: ");
    console.log(userId);
    console.log(myCart);
    return myCart;
};

module.exports = {addCart, getTotalAmount};
