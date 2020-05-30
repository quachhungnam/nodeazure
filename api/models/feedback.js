const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    created_at: {
        type: Date
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId
    },
    updated_at: {
        type: Date
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);