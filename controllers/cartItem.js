const {CartItem, CartItemModel} = require('../models/cartItem'); 
const {sendNotification} = require('../controllers/notification');
const {addBook, getBookDetails} = require('../controllers/book');
const {Cart, CartModel} = require('../models/cart');

const addBookToCart = async (userId, cartId, bookId) => {
    const status = false;
    await CartItemModel.create({
        userId,
        cartId,
        bookId,
        status
    });
    console.log("hello from cart item model!");
    const myBook = await getBookDetails(bookId);
    const notificationText = `You have added ${myBook.title} successfully`;
    const notificationType = "Cart";
    const notification = await sendNotification(userId, notificationText, notificationType);
    console.log(`You have sent this ${notification}`);
    const newItem = new CartItem({userId, cartId, bookId, status});
    console.log(newItem);
    const bookPrice = myBook.price;
    const cart = await CartModel.findOne({ userId }); // Find the cart
    let totalAmount = cart.totalAmount;
    totalAmount += bookPrice;
    const newCart = await CartModel.findOneAndUpdate(
        { userId },
        { $set: { totalAmount: totalAmount } },
        { new: true }
    );
    console.log(`Updated total amount: ${newCart}`);
    return newItem;
};

const removeBookFromCart = async (userId, cartId, bookId) => {
    const removedBook = await CartItemModel.deleteOne({userId, cartId, bookId});
    const myBook = await getBookDetails(bookId);

    const cart = await CartModel.findOne({ userId }); // Find the cart
    const bookPrice = myBook.price;
    let totalAmount = cart.totalAmount;
    totalAmount -= bookPrice;
    const newCart = await CartModel.findOneAndUpdate(
        { userId },
        { $set: { totalAmount: totalAmount } },
        { new: true } // Return the updated document
    );
    console.log(`Updated total amount: ${newCart.totalAmount}`);
    return removedBook;
}; 

const removeAllItems = async (userId) => {
    const cart = await CartModel.findOne({ userId });
    cart.totalAmount = 0;
    const removedBooks = await CartItemModel.deleteMany({userId});
    return removedBooks;
};

module.exports = {addBookToCart, removeBookFromCart, removeAllItems};
