const bcrypt = require('bcrypt');
const {User, UserModel} = require('../models/user'); 
const {addCart} = require('../controllers/cart');
const {sendNotification} = require('../controllers/notification');
const registerUser = async (req, res) => {
    try {
        console.log(req.body);
        const { firstName, lastName, email, phone, pass, confirmPass } = req.body;

        let existingUser = await User.findByEmail(email);
        // console.log(existingUser);
        if (existingUser) {
            return res.redirect('/user/register');
        }

        if(pass !== confirmPass) {
            return res.redirect('/user/register');
        }
        // console.log(lastName);
        const passwordHash = await bcrypt.hash(pass, 10);
        await UserModel.create({
            firstName,
            lastName,
            email,
            phone,
            passwordHash
        });
        const registeredUser = await UserModel.findOne({email});
        const _id = registeredUser._id;
        console.log(`registered: ${registeredUser}, userId: ${_id}`);
        const newUser = new User({ firstName, lastName, email, phone, passwordHash, _id });
        console.log(`the current user: ${newUser._id}`);
        const userId = _id;
        const userCart = await addCart(userId);
        console.log("your cart is: ")
        console.log(userCart);
        res.redirect('/user/login');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, pass } = req.body;
        // console.log(req.body);
        const theUser = await User.findByEmail(email);
        if (!theUser) {
            return res.redirect('/user/login');
        }
        const user = new User(theUser);
        // console.log(user);
        const isValidPassword = await bcrypt.compare(pass, user.passwordHash);
        if (!isValidPassword) {
            return res.redirect('/user/login');
        }
        console.log(`user is ${user}`);
        const userId = user._id;
        const notificationText = `Welcome, ${user.firstName}. You are logged in`;
        const notificationType = "Welcoming";
        const notification = await sendNotification(userId, notificationText, notificationType);
        console.log("notification: ")
        console.log(notification);
        req.session.userId = user._id;
        res.redirect(`/user/profile/${user._id}`);
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal Server Error');
    }
};

const openLoginPage = async (req, res) => {
    res.render('user/login');
};

const openRegisterPage = async (req, res) => {
    res.render('user/register');
};

const viewUserProfile = async (req, res) => {
    try {
        console.log(req.body);
        const theUser = await User.findUserById(req.params.id);
        console.log(theUser);
        if (!theUser) {
            return res.status(404).send('User not found');
        }

        const user = new User(theUser);
        res.render('user/viewUser', { user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { registerUser, loginUser, openLoginPage, openRegisterPage, viewUserProfile };
