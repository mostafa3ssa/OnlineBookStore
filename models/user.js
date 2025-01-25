const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const OrderModel = require('./order');
const CartModel = require('./cart');
const UserBooksModel = require('./userBooks');
const SupportModel = require('./support');
const siteRankingModel = require('./siteRanking');
const BookReviewsModel = require('./bookReviews');
const NotificationModel = require('./notification');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
});

userSchema.pre('remove', async function (next) {
    const userId = this._id;

    const relatedModels = [
        CartModel,
        OrderModel,
        NotificationModel,
        BookReviewsModel,
        siteRankingModel,
        UserBooksModel,
        SupportModel
    ];

    for (const thisModel of relatedModels) { 
        await thisModel.deleteMany({ userId });
    }
    console.log("HELLO FROM DLETING ALL USERS");

    next();
});



const UserModel = mongoose.model('User', userSchema);

class User {
    constructor(userData) {
        this.firstName = userData.firstName;
        this.lastName = userData.lastName;
        this.email = userData.email;
        this.phone = userData.phone;
        this.passwordHash = userData.passwordHash;
        this._id = userData._id;
    }

    static async findByEmail(email) {
        console.log(email);
        const userData = await UserModel.findOne({ email });
        return userData;
    }

    static async findUserById(id) {
        const userData = await UserModel.findById(id);
        // console.log(`come from findUserById: ${userData._id}`);
        return userData;
    }

    async validatePassword(plainPassword) {
        return bcrypt.compare(plainPassword, this.passwordHash);
    }

    static async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }
    
}

async function deleteUsersWithAssociations(filter) {
    try {
        const users = await UserModel.find(filter, '_id');
        const userIds = users.map(user => user._id);

        if (userIds.length === 0) {
            console.log('No users found for the given filter.');
            return;
        }

        const relatedModels = [
            CartModel,
            OrderModel,
            NotificationModel,
            BookReviewsModel,
            siteRankingModel,
            UserBooksModel,
            SupportModel,
        ];

        for (const model of relatedModels) {
            await model.deleteMany({ userId: { $in: userIds } });
        }

        await UserModel.deleteMany({ _id: { $in: userIds } });

        console.log(`Deleted users and all related data for user IDs: ${userIds}`);
    } catch (error) {
        console.error('Error during bulk deletion:', error);
        throw error;
    }
}

module.exports = { User, UserModel, deleteUsersWithAssociations };

