const mongoose = require('mongoose');

const supportSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: String,
    message: String,
    status: Boolean
});


const SupportModel = mongoose.model('Support', supportSchema);


class Support {
    constructor(issueData) {
        this.userId = issueData.userId;
        this.type = issueData.type;
        this.message = issueData.message;
        this.status = issueData.status;
    }
}


module.exports = {Support, SupportModel};



