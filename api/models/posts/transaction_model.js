const mongoose = require('mongoose')
const transaction_schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    locked: { type: Boolean, default: false },
    created_at: { type: Date, default: new Date() },
    update_at: { type: Date, default: null }
})

module.exports = mongoose.model('Transaction', transaction_schema)