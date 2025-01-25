const {Bank, BankModel} = require('../models/bank'); 

const addBank = async (bankName) => {
    await BankModel.create({
        bankName
    });
    const createdBank = await BankModel.findOne({bankName});
    const _id = createdBank._id;
    const newBank = new Bank({_id, bankName});
    return newBank;
};

const getBankName = async(_id) => {
    const myBank = await BankModel.findById(_id);
    return myBank.bankName;
};


module.exports = {addBank, getBankName};