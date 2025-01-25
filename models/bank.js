const mongoose = require('mongoose');

const OrderModel = require('./order');

const bankSchema = mongoose.Schema({
    bankName: String
});


bankSchema.pre('remove', async function (next) {
    const bankId = this._id;

    const relatedModels = [
        OrderModel
    ];

    for (const model of relatedModels) {
        await model.deleteMany({ bankId });
    }

    next();
});


const BankModel = mongoose.model('Bank', bankSchema);


class Bank {
    constructor(bankData) {
        this._id = bankData._id;
        this.bankName = bankData.bankName;
    }

    static async findBankById(_id) {
        const bankData = await BankModel.findById(_id);
        return bankData;
    }
}


module.exports = {Bank, BankModel};
