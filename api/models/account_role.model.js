const mongoose = require('mongoose');
const account_roleSchema = mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('account_role', account_roleSchema);